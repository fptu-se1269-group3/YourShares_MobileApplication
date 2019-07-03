import React, {Component} from "react";
import {Image, StyleSheet, View, Button} from "react-native";
import strings from '../values/Strings';
import colors from '../values/Colors';
import FormTextInput from "../components/FormTextInput";
import * as SecureStore from 'expo-secure-store';
import {KeyboardAvoidingView, StatusBar, Alert, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import {Spinner} from "native-base";
import {loginWithEmail} from "../services/AuthenticationService";
import * as Facebook from "expo-facebook";
import {Google} from 'expo';
import {Icon, Text} from "react-native-elements";

export default class LoginScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading: false
        }
    }

    handleLoginPress = () => {
        this.setState({isLoading: true});
        loginWithEmail(this.state.email, this.state.password)
            .then(response => {
                const status = response.status;
                if (status === 200) {
                    return response.json();
                } else {
                    Alert.alert(
                        'Fail to login',
                        'Wrong email or password',
                        [
                            {text: 'Try again'},
                        ]
                    );
                    return Promise.reject('Login fail')
                }
            })
            .then((responseJson) => {
                saveLogin(responseJson.jwt, responseJson.userId);
                this.props.navigation.navigate('Main');
            })
            .catch(error => {
                console.debug(`[DEBUG] ${error}`)
            })
            .done(() => this.setState({isLoading: false}))

    };

    handleFacebookLoginPress = () => {
        Facebook.logInWithReadPermissionsAsync('2475267839196769', {
            behavior: 'native'

        })
            .then(result => console.log(result))
            .catch(error => console.log(error))
    };

    handleGoogleLoginPress = async () => {
        const config = {
            androidClientId: '754455661839-524tf6ge17bpc5688ilp7boo6focic8t.apps.googleusercontent.com',
            iosClientId: '754455661839-et0kfpkkh4g4530dvp6j5hcs1uj3l6hb.apps.googleusercontent.com'
        };
        const {type, accessToken, idToken, refreshToken, user} = await Google.logInAsync(config);

        if (type === 'success') {
            console.log(`Google user: ${user}`);
            let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {Authorization: `Bearer ${accessToken}`},
            });
        }
    };

    render() {
        console.debug("Login is rendered");
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
                <KeyboardAvoidingView style={styles.form} behavior="padding" enabled>
                    {this.state.isLoading && <Spinner/>}
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
                    <View style={styles.buttons}>
                        <View style={styles.button}><Button title={strings.LOGIN}
                                  onPress={this.handleLoginPress}/></View>
                        <TouchableNativeFeedback  onPress={this.props.action}>
                            <View style={styles.facebook}>
                                <Image
                                    source={require('../assets/images/facebook.png')}
                                    style={styles.iconStyle}
                                />
                                <View style={styles.separatorFacebook} />
                                <Text style={styles.textFacebook}> {strings.FACEBOOK_LOG_IN} </Text>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback style={styles.google} onPress={this.props.action}>
                            <View style={styles.google}>
                                <Image
                                    source={require('../assets/images/google.png')}
                                    style={styles.iconStyle}
                                />
                                <View style={styles.separatorGoogle} />
                                <Text style={styles.textGoogle}> {strings.GOOGLE_LOG_IN} </Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
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

function saveLogin(jwt, userId) {
    SecureStore.setItemAsync('jwt', jwt, {
        keychainAccessible: SecureStore.ALWAYS
    });
    SecureStore.setItemAsync('userId', userId, {
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
        flex: 0.8,
        resizeMode: "contain",
        alignSelf: "center",
        width: "60%"
    },
    form: {
        flex: 1.2,
        justifyContent: "center",
        width: "75%"
    },
    buttons: {
        flex: 0.6,
        justifyContent: "center"
    },
    button: {
        borderRadius: 5,
        margin: 10,
        height: 40
    },
    facebook: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4267B2',
        borderWidth: 0.5,
        borderColor: '#fff',
        height: 40,
        borderRadius: 5,
        margin: 5
    },
    google: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 0.5,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#00005F',
        height: 40,
        borderRadius: 5,
        margin: 5
    },
    iconStyle: {
        padding: 5,
        height: 35,
        width: 40,
        resizeMode: 'contain',
    },
    textFacebook: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'roboto',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    textGoogle: {
        color: "#000000",
        fontSize: 16,
        fontFamily: 'roboto',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    separatorFacebook: {
        backgroundColor: '#fff',
        width: 1,
        height: 40,
    },
    separatorGoogle: {
        backgroundColor: '#000',
        width: 0.5,
        height: 40,
    }
});
