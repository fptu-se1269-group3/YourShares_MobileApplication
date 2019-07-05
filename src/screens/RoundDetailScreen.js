import React, {Component} from 'react'
import {View, Text} from "react-native";

export default class RoundDetailScreen extends Component {
    static navigationOptions = {
        title: 'Round Details'
    };

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>
                <Text>This is round detail screen</Text>
            </View>
        );
    }

}