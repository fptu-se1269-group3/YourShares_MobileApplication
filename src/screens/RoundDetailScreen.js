import React, {Component} from 'react'
import {View, Text} from "react-native";

export default class RoundDetailScreen extends Component {
    static navigationOptions = {
        title: 'Round Details'
    };

    constructor(props) {
        super(props);
        console.log(this.props.navigation.getParam('roundInvestors'))
    }

    render() {
        return (
            <View>
                <Text>This is round detail screen</Text>
                <Text>Navigate data print in console for testing</Text>
            </View>
        );
    }

}