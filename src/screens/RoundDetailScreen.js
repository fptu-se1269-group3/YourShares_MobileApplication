import React, {Component} from 'react'
import {View, Text, StyleSheet, FlatList} from "react-native";
import {ScrollView} from "react-navigation";

export default class RoundDetailScreen extends Component {
    static navigationOptions = {
        title: 'Round Details'
    };

    constructor(props) {
        super(props);
        console.log(this.props.navigation.getParam('roundInvestors'))
    }

    _renderItem = ({item}) => {
        return (
            <View>
                <Text>{item.investorName}</Text>
                <Text>{item.shareAmount}</Text>
                <Text>{item.investedValue}</Text>
                <Text>{item.sharesHoldingPercentage}</Text>
            </View>
        );
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text>This is round detail screen</Text>
                <Text>Navigate data print in console for testing</Text>
                <FlatList keyExtractor={item => item.roundInvestorId}
                          data={this.props.navigation.getParam('roundInvestors')}
                          renderItem={this._renderItem}
                          />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});