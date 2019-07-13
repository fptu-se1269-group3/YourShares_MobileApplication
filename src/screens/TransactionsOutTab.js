import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { Spinner, Card, CardItem, Body } from "native-base";
import colors from '../values/Colors'
import jslinq from 'jslinq';

export default class TransactionsOutTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            arrayResult: [],
            firstTime: true,
        }
    }
    componentDidMount(props) {
        if (this.state.firstTime) {
            this.setState({
                arrayResult: this.props.arrayTransaction,
                firstTime: false
            });
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
                    .where(function (item) {
                        return item.transactionDate >= fromDate
                    })
                    .where(function (item) {
                        return item.transactionDate <= toDate
                    }).orderByDescending(function (item)
                    {
                        return item.transactionDate
                    })
                    .toList();
                this.setState({
                    arrayResult: queryObj
                });
            } else {
                const shareAccountIds = this.props.arrayShareAccount[this.props.selected];
                myList = this.props.arrayTransaction;
                queryObj = jslinq(myList)
                    .where(function (item) {
                        return item.shareAccountId === shareAccountIds
                    })
                    .where(function (item) {
                        return item.transactionDate >= fromDate
                    })
                    .where(function (item) {
                        return item.transactionDate <= toDate
                    }).orderByDescending(function (item)
                    {
                        return item.transactionDate
                    })
                    .toList();
                this.setState({
                    arrayResult: queryObj,
                });
            }
        }
    }

    renderCard(i) {
        return (
            <View>
                <Card pointerEvents="none" >
                    <CardItem bordered style={{borderWidth:1}}>
                        <Body>
                            <Text style={{ textAlign: 'right', alignSelf: 'flex-end', color: colors.TEXT_COLOR }}>
                                ${this.state.arrayResult[i].transactionValue}
                            </Text>
                            <Text style={{ position: 'relative', top: -14, color: colors.TEXT_COLOR }}>
                                {new Date(this.state.arrayResult[i].transactionDate * 1000).toLocaleString()}      
                                <Text style={{ color: this.state.arrayResult[i].transactionStatusCode === 'CMP' ? "green" 
                                            : this.state.arrayResult[i].transactionStatusCode === 'RJ' ? "red":"orange"}}>
                                {this.state.arrayResult[i].transactionStatusCode === 'CMP' ? "Completed" :  
                                this.state.arrayResult[i].transactionStatusCode === 'RJ' ? "Rejected":"Pending"}
                            </Text>
                            </Text>
                            <Text style={{ position: 'absolute', bottom: 3, fontSize: 15.5 }}>
                                {this.state.arrayResult[i].message}
                            </Text>
                            <Text style={{ color: this.state.arrayResult[i].transactionTypeCode === 'IN' ? "green" : "red", textAlign: 'right', alignSelf: 'flex-end' }}>
                                {this.state.arrayResult[i].transactionTypeCode === 'IN' ? "+" : "-"}{this.state.arrayResult[i].transactionAmount}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        );
    }

    renderCards() {
        const card = [];
        for (let i = 0; i < this.state.arrayResult.length; i++) {
            if (this.props.arrayTransaction[i].transactionTypeCode === 'OUT') {
                // if (Platform.OS === 'ios') {
                if (Platform.OS === 'ios') {
                    card.push(
                        <TouchableOpacity key={this.state.arrayResult[i].transactionId}>
                            {this.renderCard(i)}
                        </TouchableOpacity>
                    )
                } else {
                    card.push(
                        <TouchableNativeFeedback key={this.state.arrayResult[i].transactionId} useForeground={true}>
                            {this.renderCard(i)}
                        </TouchableNativeFeedback>
                    )
                }
            }
        }
        return card;
    };

    render() {
        return (
            <ScrollView>
                {this.props.isLoading && <Spinner color={colors.HEADER_LIGHT_BLUE} style={{marginTop: '50%', paddingBottom: '10%'}}/>}
                {this.renderCards()}
            </ScrollView>
        );
    }
}