import React, {Component} from 'react';
import {View, Text, Button} from "react-native";

export default class RoundScreen extends Component{
    constructor(props) {
        super(props);
        console.log(props.navigation.getParam('rounds'));
        this.state = {

        }
    }

    render() {
        return (
            <View>
                <Text>This is rounds screen</Text>
            </View>
        );
    }
}