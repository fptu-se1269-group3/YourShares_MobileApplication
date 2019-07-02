import React, {Component} from 'react';
import {View, Text} from "react-native";

export default class SettingsScreen extends Component{
    static navigationOptions = {
        title: "Settings"
    };
    render() {
        return (
            <View>
                <Text>
                    Your're at settings tab
                </Text>
            </View>
        )
    }
}
