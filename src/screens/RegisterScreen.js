import React, {Component} from "react";
import strings from '../values/Strings';
import colors from '../values/Colors';
import FormTextInput from "../components/FormTextInput";
import * as SecureStore from 'expo-secure-store';

import {
    KeyboardAvoidingView,
    StatusBar,
    Alert,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform,
    Text,
    Image,
    StyleSheet,
    View,
    Button,
    Dimensions
} from 'react-native';
import {Spinner} from "native-base";
import {createProfileOAuth, loginWithEmail, loginWithOAuth, registerWithEmail} from "../services/AuthenticationService";
import * as Facebook from "expo-facebook";
import {Google} from 'expo';
import * as LocalAuthentication from 'expo-local-authentication';

export default class LoginScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rePassword: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            isLoading: false
        }
    }

    handleRegisterPress = () => {
        if (!this._validateEmail()) {
            Alert.alert('Register fail', 'Please enter an valid email', [{text: 'TRY AGAIN'}]);
            return;
        }
        if (!this._validateStrongPassword()) {
            Alert.alert('Register fail', 'Password must have more than 8 characters, contain at least 1 special character and 1 number', [{text: 'TRY AGAIN'}]);
            return;
        }

        if (!this._validateRePassword()) {
            Alert.alert('Register fail', 'Password do not match', [{text: 'TRY AGAIN'}]);
            return;
        }

        this.setState({isLoading: true});
        registerWithEmail({
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            address: this.state.address
        })
            .then(response => {
                console.log(JSON.stringify(response));
                const status = response.status;
                if (status === 201) {
                    return Promise.resolve();
                } else if (status === 400) {
                    return response.json();
                }  else {
                    return Promise.reject('Register fail')
                }
            })
            .then(json => {
                this.setState({isLoading: true});
                if (json === undefined) {
                    Alert.alert(
                        'Success',
                        'Register complete',
                        [
                            {text: 'LOG IN',
                                onPress: () => this.props.navigation.navigate('Login')
                            },
                        ]
                    );
                }
                else if (json.ErrorMessage.toUpperCase() === 'EMAIL EXISTED') {
                    Alert.alert(
                        'Register fail',
                        'This email has been registered.',
                        [
                            {text: 'TRY AGAIN'}
                        ]
                    );
                }
            })
            .catch(error => {
                this.setState({isLoading: false});
                Alert.alert(
                    'Fail to Register',
                    'Error',
                    [
                        {text: 'TRY AGAIN'},
                    ]
                );
                console.debug(`[DEBUG] ${error}`)
            })
    };

    _validateEmail = () => {
        const emailRegex = /^[\w-.]*@[\w*-.]*\.[\w*-]*$/;
        return emailRegex.test(this.state.email);
    };

    _validateStrongPassword = () => {
        const passwordRegex = /^(?=.*[!@#$&*])(?=.*[a-z]).{8,}$/;
        return passwordRegex.test(this.state.password);
    };

    _validateRePassword = () => {
        return this.state.password === this.state.rePassword;
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
                <KeyboardAvoidingView style={styles.form} behavior={"padding"}
                                      enabled>
                    {this.state.isLoading && <Spinner color={colors.HEADER_LIGHT_BLUE} style={styles.spinner}/>}
                    <FormTextInput
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                        placeholder={strings.EMAIL_REGISTER_PLACEHOLDER}
                    />
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password})}
                        placeholder={strings.PASSWORD_REGISTER_PLACEHOLDER}
                        secureTextEntry={true}
                    />
                    <FormTextInput
                        value={this.state.rePassword}
                        onChangeText={(rePassword) => this.setState({rePassword})}
                        placeholder={strings.RE_PASSWORD_REGISTER_PLACE_HOLDER}
                        secureTextEntry={true}
                    />
                    <View style={{flexDirection: 'row'}} >
                        <FormTextInput
                            style={{alignItems:'flex-start', flex: 1, marginRight: "10%"}}
                            value={this.state.firstName}
                            onChangeText={(firstName) => this.setState({firstName})}
                            placeholder={strings.FIRST_NAME_REGISTER}
                        />
                        <FormTextInput
                            style={{alignItems: 'flex-end', flex: 2, marginRight: "10%"}}
                            value={this.state.lastName}
                            onChangeText={(lastName) => this.setState({lastName})}
                            placeholder={strings.LAST_NAME_REGISTER}
                        />
                    </View>
                    <FormTextInput
                        value={this.state.phone}
                        onChangeText={(phone) => this.setState({phone})}
                        placeholder={strings.PHONE_REGISTER}
                        keyboardType={"numeric"}
                    />
                    <FormTextInput
                        value={this.state.address}
                        onChangeText={(address) => this.setState({address})}
                        placeholder={strings.ADDRESS_REGISTER}
                    />
                    <View style={styles.button}>
                        <Button title={strings.REGISTER} onPress={this.handleRegisterPress}/>
                    </View>
                    <Text style={{textAlign: 'center', fontSize: 15, color: '#7a7676', marginTop: "2%"}}>Already have and account?
                        <Text style={{color: colors.TEXT_LINK, fontWeight: 'bold'}}
                              onPress={() => this.props.navigation.navigate('Login')}> Login</Text>
                    </Text>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        flex: 0.6,
        resizeMode: "contain",
        alignSelf: "center",
        width: "60%",
        marginTop: "10%"
    },
    form: {
        flex: 2,
        justifyContent: "center",
        width: "75%",
    },
    spinner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        borderRadius: 5,
        height: 40,
    },
    iconStyle: {
        padding: 5,
        height: 35,
        width: 40,
        resizeMode: 'contain',
    },
});
