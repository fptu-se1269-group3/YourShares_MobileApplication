import React, {Component} from "react";
import {Image, StyleSheet, View, Button, Text} from "react-native";
import strings from '../values/Strings';
import colors from '../values/Colors';
import FormTextInput from "../components/FormTextInput";
import * as SecureStore from 'expo-secure-store';
import Base64 from "Base64";
import {KeyboardAvoidingView, StatusBar} from 'react-native';

interface State {
    email: string;
    password: string;
}

class LoginScreen extends Component<{}, State> {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    handleLoginPress = () => {
        console.log("Login button pressed");
        const email = this.state.email;
        const password = this.state.password;
        const credentials = Base64.btoa(`${email}:${password}`);
        fetch('http://api.yourshares.tk/auth', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw Error;
            }

        })
            .then((responseJson) => {
                saveLogin(responseJson.jwt, responseJson.userId);
                this.props.navigation.navigate('Main');
            })
            .catch((error) => {
                console.log(error.message);
                alert('Wrong email or password!!!');
            });

    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
                <KeyboardAvoidingView style={styles.form} behavior="padding" enabled>
                    <FormTextInput
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                        placeholder={strings.EMAIL_PLACEHOLDER}
                    />
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password})}
                        placeholder={strings.PASSWORD_PLACEHOLDER}
                        secureTextEntry={true}
                    />
                    <Button title={strings.LOGIN} onPress={this.handleLoginPress}/>
                    {
                        __DEV__
                            ?
                            <View style={{marginTop: 10}}>
                                <Button title={"[DEV] Take me in"}
                                        onPress={() => this.props.navigation.navigate('Main')}
                                        color={"red"}/>
                            </View>
                            :
                            <View/>
                    }
                </KeyboardAvoidingView>

            </View>
        );
    }
}

function saveLogin(jwt, id) {
    SecureStore.setItemAsync('jwt', jwt, {
        keychainAccessible: SecureStore.ALWAYS
    });
    SecureStore.setItemAsync('id', id, {
        keychainAccessible: SecureStore.ALWAYS
    });
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        flex: 1,
        resizeMode: "contain",
        alignSelf: "center",
        width: "60%"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
    }
});

export default LoginScreen;