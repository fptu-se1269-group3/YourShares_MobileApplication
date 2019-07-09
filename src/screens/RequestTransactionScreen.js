import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Form, Item, Input, Label, Content, Picker} from 'native-base';
import {Button} from "react-native";


export default class RequestTransactionScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            company: '',
            receiver: '',
            amount: 0,
            value: 0,
            selected: 'c'
        }
    }

    _handleSubmitPress = () => {

    };

    render() {
        return (
            <View style={styles.container}>
                <Form style={styles.form}>
                    <Picker
                        mode="dropdown"
                        iosHeader="Company"
                        placeholderStyle={{maxWidth: '100%'}}
                        textStyle={{maxWidth: '130%'}}
                        selectedValue={this.state.selected}
                        onValueChange={(selected) => this.setState({selected})}>
                        <Picker.Item label={"Company"} value={"c"}/>
                    </Picker>
                    <Item floatingLabel>
                        <Label>Receiver name</Label>
                        <Input value={this.state.receiver}
                               onChangeText={receiver => this.setState({receiver})}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Amount</Label>
                        <Input keyboardType={"numeric"}
                               value={this.state.amount}
                               onChangeText={amount => this.setState({amount})}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Value</Label>
                        <Input keyboardType={"numeric"}
                               value={this.state.value}
                               onChangeText={value => this.setState({value})}
                        />
                    </Item>
                    <View style={styles.button}>
                        <Button title={"Submit"} onPress={this._handleSubmitPress}/>
                    </View>
                </Form>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    form: {
        width: "80%",
        alignSelf: 'center',
    },
    button: {
        marginTop: "10%"
    }
});