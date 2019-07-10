import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Form, Item, Input, Label, Content, Picker, Icon } from 'native-base';
import { Button } from "react-native";


export default class RequestTransactionScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            company: '',
            receiver: this.props.navigation.getParam('Id'),
            receiverId: '',
            amount: '',
            value: '',
            selected: 'c',
            message: '',
            arrayCompanyName: [],
            arrayCompanyId: [],
            arrayShareholder: [],
            arrayShareAccount: []
        }
    }
    async componentDidMount() {
        await this.getName();
        await this.callAPI(global["userId"]);
        await this.getTransaction();
        console.log(this.state.arrayShareAccount.length)
    }

    async callAPI(id) {
        console.log(id)
        this.setState({ isLoading: true });
        const response = await fetch('http://api.yourshares.tk/api/shareholders/users/' + id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global['jwt']}`
            },
        });
        const responseJson = await response.json();
        for (let i = 0; i < responseJson.count; i++) {
            this.setState({
                arrayCompanyId: [...this.state.arrayCompanyId, responseJson['data'][i].companyId],
                arrayShareholder: [...this.state.arrayShareholder, responseJson['data'][i]]
            }
            );
            const response2 = await fetch('http://api.yourshares.tk/api/companies/' + responseJson['data'][i].companyId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${global['jwt']}`
                },

            });
            const responseJson2 = await response2.json();
            console.log(responseJson2['data'].companyName)
            this.setState({
                arrayCompanyName: [...this.state.arrayCompanyName, responseJson2['data'].companyName]
            })
        }
    }

    async getTransaction() {
        for (let i = 0; i < this.state.arrayShareholder.length; i++) {
            const response = await fetch('http://api.yourshares.tk/api/share-accounts/shareholders/' + this.state.arrayShareholder[i].shareholderId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${global['jwt']}`
                },
            });
            const responseJson = await response.json();

            for (let i = 0; i < responseJson['data'].length; i++) {
                if (responseJson['data'][i] !== undefined) {
                    if (responseJson['data'][i].name === 'Standard') {
                        this.setState({
                            arrayShareAccount: [...this.state.arrayShareAccount, responseJson['data'][i].shareAccountId]
                        });
                    }
                }
            }
        }
    }

    renderPicker() {
        const picker = [];
        for (let i = 0; i < this.state.arrayCompanyId.length; i++) {
            picker.push(
                <Picker.Item key={this.state.arrayCompanyId[i]} label={this.state.arrayCompanyName[i]} value={i} />
            )
        }
        return picker;
    }
    async getName() {
        const response = await fetch('http://api.yourshares.tk/api/users/' + this.state.receiver, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global['jwt']}`
            },

        });
        const responseJson = await response.json();
        this.setState({
            receiverId: `${responseJson['data'].firstName} ${responseJson['data'].lastName}`
        })
    }

    async _handleSubmitPress(){
        const { navigation } = this.props;
        const response = await fetch('http://api.yourshares.tk/api/transactions', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global['jwt']}`
            },
            body: JSON.stringify({
                "message": this.state.message,
                "receiverProfileId": this.state.receiver,
                "shareAccountId": this.state.arrayShareAccount[this.state.selected],
                "companyId": this.state.arrayCompanyId[this.state.selected],
                "value": this.state.value,
                "amount": this.state.amount
            })
        });
        const responseJson = await response.json();
        console.log(responseJson.isSuccess);
        navigation.navigate('Profile');
    };

    render() {
        
        return (
            <View style={styles.container}>
                <Form style={styles.form}>

                    <Item fixedLabel last>
                        <Label>Receiver name</Label>
                        <Text >{this.state.receiverId}</Text>
                    </Item>
                    <Item picker>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            iosHeader="Company"
                            placeholderStyle={{ maxWidth: '100%' }}
                            textStyle={{ maxWidth: '100%' }}
                            selectedValue={this.state.selected}
                            onValueChange={(selected) => this.setState({ selected })}>
                            <Picker.Item label={"Select Company .."} value={"c"} />
                            {this.renderPicker()}
                        </Picker>
                    </Item>
                    <Item floatingLabel last>
                        <Label>Amount</Label>
                        <Input keyboardType={"numeric"}
                            value={this.state.amount}
                            onChangeText={amount => this.setState({ amount })}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Value</Label>
                        <Input keyboardType={"numeric"}
                            value={this.state.value}
                            onChangeText={value => this.setState({ value })}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Transaction message</Label>
                        <Input
                            value={this.state.message}
                            onChangeText={message => this.setState({ message })}
                        />
                    </Item>
                    <View style={styles.button}>
                        <Button title={"Submit"} onPress={()=>this._handleSubmitPress()} />
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