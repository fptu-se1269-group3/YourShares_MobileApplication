import React, {Component} from "react";
import {Text} from "react-native";

export default class TransactionsScreen extends Component{
    render() {
        return (
          <Text>
              This is a sample text that I'm trying to test the hot reloading
          </Text>
        );
    }
}


TransactionsScreen.navigationOptions = {
    headerMode: 'none'
};