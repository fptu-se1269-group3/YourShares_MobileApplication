import React, {Component} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Dimensions} from "react-native";

export class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        }
    }

    handleEmail = (text) => {
        this.setState({email: text})
    };

    handlePassword = (text) => {
        this.setState({password: text})
    };


    login = (email, pass) => {
        fetch('http://api.yourshares.tk/api/users/auth', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: pass,
            })
        }).then((response) => response.json())
            .then((responseJson) => {

                return responseJson.jwt;
            })
            .catch((error) => {
                alert('Wrong email or password!!!');
            });

    };

    render() {

        return (
            <View style={Style.container}>
                <Text style={Style.h1}>Login</Text>
                <Image source={require('../../assets/img/apple-touch-icon-57x57.png')} style={Style.img}/>
                <Text style={Style.text}>YOUR SHARES</Text>
                <Text style={Style.h2}>Email </Text>
                <TextInput style={Style.input} ref={input => {
                    this.emailInput = input
                }}
                           underlineColorAndroid="transparent"
                           onChangeText={this.handleEmail}
                />
                <Text style={Style.h2}>Password </Text>
                <TextInput style={Style.input} ref={input => {
                    this.passwordInput = input
                }}
                           underlineColorAndroid="transparent"
                           secureTextEntry={true}
                           onChangeText={this.handlePassword}
                />
                <TouchableOpacity style={Style.button} onPress={() => {
                    this.login(this.state.email, this.state.password)
                }}>
                    <Text style={Style.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Style.buttonGoogle}>

                    <Text style={Style.buttonText1}>Sign up with Google+</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    this.register()
                }}>
                    <Text style={Style.h4}>Don`t have account yet?<Text style={Style.h5}> Register</Text></Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Style = StyleSheet.create({
    container: {
        paddingTop: 23,
        flex: 1,
        backgroundColor: '#181922',

    },
    img: {
        width: 114,
        height: 114,
        marginLeft: screenWidth*0.3345,
        marginTop: screenHeight*0.01,

    },

    imgIcon: {
        width: 50,
        height: 49,
    },
    input: {
        margin: 15,
        height: 50,
        marginTop: -3,
        borderColor: '#48484D',
        backgroundColor: '#2C2C37',
        borderWidth: 1,
        color: 'white',
        fontSize: 15,
        borderRadius: 2,
    },
    button: {
        backgroundColor: '#181922',
        padding: 10,
        margin: 15,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#700000',
        borderWidth: 1,
        borderRadius: 2,

    },

    buttonGoogle: {
        backgroundColor: '#700000',
        padding: 10,
        margin: 15,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#700000',
        borderWidth: 1,
        borderRadius: 2,

    },

    buttonText: {
        fontSize: 20,
        color: '#700000',

    },

    buttonText1: {
        fontSize: 20,
        color: 'white',
    },
    h1: {
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
        color: '#D7D8E4',
        fontWeight: 'bold',
        marginTop: -15,
    },

    h2: {
        fontSize: 15,
        margin: 10,
        marginLeft: 20,
        color: '#D7D8E4',
        fontWeight: 'bold',
        marginTop: -5,
    },

    h3: {
        fontSize: 15,
        textAlign: 'center',
        color: '#700000',
        fontWeight: 'bold',
        marginTop: 10,
    },
    h4: {
        fontSize: 15,
        textAlign: 'center',
        color: '#D7D8E4',
        fontWeight: 'bold',
        marginTop: 10,
    },
    h5: {
        fontSize: 20,
        textAlign: 'center',
        color: '#700000',
        fontWeight: 'bold',
        marginTop: 10,
    },

    text: {

        fontSize: 30,
        textAlign: 'center',
        margin: 10,
        color: '#700000',
        fontWeight: 'bold'
    },

});
export default Style;