import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList} from 'react-native';
import {Spinner, Card, CardItem, Body, Right} from "native-base";
import colors from '../values/Colors';
import jslinq from 'jslinq';
import moment from "moment";
import Numeral from "numeral";

export default class TransactionsAllTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transactions: this.props.arrayTransaction,
            firstTime: true,
        }
    }

    componentDidUpdate(oldProps) {
        let myList;
        let queryObj;
        const newProps = this.props;
        if (oldProps.selected !== newProps.selected || oldProps.date !== newProps.date || oldProps.date2 !== newProps.date2) {
            const fromDate = this.props.date !== undefined ? new Date(this.props.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime() / 1000.0 : 0;
            const toDate = isNaN((new Date(this.props.date2.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime() / 1000.0))
                ? new Date().getTime() / 1000.0
                : new Date(this.props.date2.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime() / 1000.0;
            if (this.props.selected === 'all') {
                myList = this.props.arrayTransaction;
                queryObj = jslinq(myList)
                    .where(item => item.transactionDate >= fromDate)
                    .where(item => item.transactionDate <= toDate)
                    .orderByDescending(item => item.transactionDate)
                    .toList();
                this.setState({transactions: queryObj});
            } else {
                const shareAccountIds = this.props.arrayShareAccount[this.props.selected];
                myList = this.props.arrayTransaction;
                queryObj = jslinq(myList)
                    .where(item => item.shareAccountId === shareAccountIds)
                    .where(item => item.transactionDate >= fromDate)
                    .where(item => item.transactionDate <= toDate)
                    .orderByDescending(item => item.transactionDate)
                    .toList();
                this.setState({transactions: queryObj});
            }
        } else if (!this.props.isLoading && this.state.firstTime) {
            let list = this.props.arrayTransaction;
            let queryObj = jslinq(list).orderByDescending(function (item) {
                return item.transactionDate
            })
                .toList();
            this.setState({
                transactions: queryObj,
                firstTime: false
            });

        }

    }

    // from unix timestamp
    _formatDate = (val) => moment.unix(val).format('MMM. DD YYYY');

    _formatCurrency = (val) => Numeral(val).format('($ 0,0.[00] )');

    _renderItem = ({item}) => {
        return (
            <Card>
                <CardItem bordered style={{borderWidth: 1, justifyContent: 'space-between'}}>
                    <Body>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: colors.TEXT_COLOR, alignSelf: 'flex-start', flex: 1}}>
                                {this._formatDate(item.transactionDate)}
                            </Text>
                            <Text style={{
                                color: item.transactionStatusCode === 'CMP' ? "green"
                                    : item.transactionStatusCode === 'RJ' ? "red" : "orange",
                                flex: 1, textAlign: 'center'
                            }}>
                                {item.transactionStatusCode === 'CMP' ? "Completed" :
                                    item.transactionStatusCode === 'RJ' ? "Rejected" : "Pending"}
                            </Text>
                            <Text style={{alignSelf: 'flex-end', flex: 1, textAlign: 'right'}}>
                                {this._formatCurrency(item.transactionValue)}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 2, alignSelf: 'flex-start'}}>
                                {item.message}
                            </Text>
                            <Text style={{textAlign: 'right', flex: 1, alignSelf: 'flex-end',
                                color: item.transactionTypeCode === 'IN' ? "green" : "red"}}>
                                {item.transactionTypeCode === 'IN' ? "+" : "-"}{item.transactionAmount}
                            </Text>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        );
    };

    render() {
        return (
            <View>
                {this.props.isLoading &&
                <Spinner color={colors.HEADER_LIGHT_BLUE} style={{marginTop: '30%', paddingBottom: '10%'}}/>}
                <FlatList keyExtractor={(item) => item.transactionId}
                          data={this.state.transactions}
                          renderItem={this._renderItem}
                />
            </View>
        )
    }
}
