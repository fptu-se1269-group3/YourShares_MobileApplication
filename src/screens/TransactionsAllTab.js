import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { Spinner, Card, CardItem, Body } from "native-base";
import colors from '../values/Colors';
import jslinq from 'jslinq';

export default class TransactionsAllTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            arrayResult: [],
            firstTime: true,
        }
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props;
        if (oldProps.selected !== newProps.selected || oldProps.date !== newProps.date || oldProps.date2 !== newProps.date2) {
            var fromDate = this.props.date != undefined ? new Date(this.props.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime() / 1000.0 : 0;
            var toDate = isNaN((new Date(this.props.date2.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime() / 1000.0))
                ? new Date().getTime() / 1000.0
                : new Date(this.props.date2.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime() / 1000.0;
            if (this.props.selected == 'all') {
                var myList = this.props.arrayTransaction;
                var queryObj = jslinq(myList)
                    .where(function (item) { return item.transactionDate >= fromDate })
                    .where(function (item) { return item.transactionDate <= toDate })
                    .toList();
                this.setState({
                    arrayResult: queryObj
                });
            }
            else {
                var shareAccountIds = this.props.arrayShareAccount[this.props.selected];
                var myList = this.props.arrayTransaction;
                var queryObj = jslinq(myList)
                    .where(function (item) { return item.shareAccountId == shareAccountIds })
                    .where(function (item) { return item.transactionDate >= fromDate })
                    .where(function (item) { return item.transactionDate <= toDate })
                    .toList();
                this.setState({
                    arrayResult: queryObj,
                });
            }
        } else if (!this.props.isLoading && this.state.firstTime) {
            this.setState({
                arrayResult: this.props.arrayTransaction,
                firstTime: false
            });

        }

    }

    renderCards() {
        const card = [];
        for (let i = 0; i < this.state.arrayResult.length; i++) {
            // if (Platform.OS === 'ios') {
            card.push(
                <TouchableOpacity key={this.state.arrayResult[i].transactionId}>
                    <View>
                        <Card style={{ borderRadius: 10 }} pointerEvents="none">
                            <CardItem bordered>
                                <Body>
                                    <Text>
                                        Type: {this.state.arrayResult[i].transactionTypeCode}
                                    </Text>
                                    <Text>
                                        transactionDate: {new Date(this.state.arrayResult[i].transactionDate * 1000).toLocaleString()}
                                    </Text>
                                    <Text>
                                        transactionAmount: {this.state.arrayResult[i].transactionAmount}
                                    </Text>
                                    <Text>
                                        transactionValue: {this.state.arrayResult[i].transactionValue}
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </View>
                </TouchableOpacity>
            )
            //     } else {
            //         card.push(
            //             <TouchableNativeFeedback key={this.state.data[i].companyId}
            //                 onPress={() => navigation.push('Company', { companyId: this.state.data[i].companyId })}
            //                 useForeground={true}>
            //             </TouchableNativeFeedback>
            //         )
            //     }
        }
        return card;
    };

    render() {
        if (this.props.isLoading) {
            return <Spinner color={colors.HEADER_LIGHT_BLUE} style={{ marginTop: '30%' }} />;
        }

        return (
            < View >
                {this.renderCards()}
            </View >
        );
    }
}