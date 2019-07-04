import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { Spinner, Card, CardItem, Body } from "native-base";
import colors from '../values/Colors'

export default class TransactionsAllTab extends Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

    renderCards() {
        const card = [];
        for (let i = 0; i < this.props.arrayTransaction.length; i++) {
            // if (Platform.OS === 'ios') {
            card.push(
                <TouchableOpacity key={this.props.arrayTransaction[i].transactionId}>
                    <View>
                        <Card style={{ borderRadius: 10 }} pointerEvents="none">
                            <CardItem bordered>
                                <Body>
                                    <Text>
                                        Type: {this.props.arrayTransaction[i].transactionTypeCode}

                                    </Text>
                                    <Text>
                                        transactionDate: {new Date(this.props.arrayTransaction[i].transactionDate * 1000).toLocaleString()}
                                    </Text>
                                    <Text>
                                        transactionAmount: {this.props.arrayTransaction[i].transactionAmount}
                                    </Text>
                                    <Text>
                                        transactionValue: {this.props.arrayTransaction[i].transactionValue}
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