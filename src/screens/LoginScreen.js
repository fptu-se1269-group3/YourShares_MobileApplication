import React, { Component } from "react";
import { Image, StyleSheet, View, Button, Dimensions } from "react-native";
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
    Text
} from 'react-native';
import { Spinner } from "native-base";
import { createProfileOAuth, loginWithEmail, loginWithOAuth } from "../services/AuthenticationService";
import * as Facebook from "expo-facebook";
import { Google } from 'expo';
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
            isLoading: false,
            isDoneRenderfirstTime: false,
        }
    }

    async componentDidMount() {
        await (Promise.all([SecureStore.getItemAsync('isfingersprintAuth')])
            .then((isfingersprintAuth) => {
                global["isfingersprintAuth"] = isfingersprintAuth;
            }));
        await this.handleFingerprint();
    }

    async handleFingerprint() {
        if (global["isfingersprintAuth"] == "1") {
            var hashHardware = await LocalAuthentication.authenticateAsync()
            if (hashHardware.success) {
                this.props.navigation.navigate('Main')
            } else {
                Alert.alert(
                    'Wrong Fingersprint',
                    'Try to login manually',
                    [
                        { text: 'Ok' },
                    ]
                );
            }
        }
    }

    handleLoginPress = () => {
        this.setState({ isLoading: true });
        loginWithEmail(this.state.email, this.state.password)
            .then(response => {
                const status = response.status;
                if (status === 200) {
                    return response.json();
                } else {
                    return Promise.reject('Login fail')
                }
            })
            .then((responseJson) => {
                this.setState({ isLoading: false });
                saveLogin(responseJson.jwt, responseJson.userId);
                this.props.navigation.navigate('Main');
            })
            .catch(error => {
                this.setState({ isLoading: false });
                Alert.alert(
                    'Fail to login',
                    'Wrong email or password',
                    [
                        { text: 'TRY AGAIN' },
                    ]
                );
                console.debug(`[DEBUG] ${error}`)
            })

    };

    handleFacebookLoginPress = async () => {
        const { type, token, expires, permissions, declinedPermissions } = await Facebook
            .logInWithReadPermissionsAsync(strings.FACEBOOK_APP_ID);
        if (type === 'success') {
            fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,first_name,last_name,email,picture.type(large)`)
                .then(response => response.json())
                .then(json => {
                    console.log(`Facebook user: ${json}`);
                    loginWithOAuth(json.id, 'facebook')
                        .then(response => {
                            const status = response.status;
                            if (status === 200) {
                                return response.json()
                            } else {
                                return createProfileOAuth({
                                    accountId: json.id,
                                    firstName: json.first_name,
                                    lastName: json.last_name,
                                    email: json.email,
                                    photoUrl: json.picture.data.url
                                }, 'facebook')
                                    .then(response => response.json())
                                    .catch(error => console.log(error))
                            }
                        })
                        .then(json => {
                            saveLogin(json.jwt, json.userId);
                            this.props.navigation.navigate('Main');
                        })
                        .catch(error => console.log(error));
                })

        } else {
            Alert.alert(
                'Facebook login failed',
                'Permission denied',
                [
                    { text: 'DONE' },
                ]
            );
            console.log('Facebook login permission denied');
        }
    };

    handleGoogleLoginPress = async () => {
        const config = {
            androidClientId: strings.GOOGLE_ANDROID_APP_ID,
            iosClientId: strings.GOOGLE_IOS_APP_ID
        };
        const { type, accessToken, idToken, refreshToken, user } = await Google.logInAsync(config);

        if (type === 'success') {
            console.log(`Google user: ${JSON.stringify(user)}`);
            loginWithOAuth(user.id, 'google')
                .then(response => {
                    const status = response.status;
                    if (status === 200) {
                        return response.json()
                    } else {
                        return createProfileOAuth({
                            accountId: user.id,
                            firstName: user.givenName,
                            lastName: user.familyName,
                            email: user.email,
                            photoUrl: user.photoUrl
                        }, 'google')
                            .then(response => response.json())
                            .catch(error => console.log(error))
                    }
                })
                .then(json => {
                    saveLogin(json.jwt, json.userId);
                    this.props.navigation.navigate('Main');
                })
                .catch(error => console.log(error));
        } else {
            Alert.alert(
                'Google login failed',
                'Permission denied',
                [
                    { text: 'DONE' },
                ]
            );
            console.log('Google login permission denied');
        }
    };

    render() {
        const { width, height } = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <KeyboardAvoidingView style={styles.form} behavior={"padding"}
                    enabled>
                    {this.state.isLoading && <Spinner color={colors.HEADER_LIGHT_BLUE} style={styles.spinner} />}
                    <View>
                        <FormTextInput
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })}
                            placeholder={strings.EMAIL_PLACEHOLDER}
                        />
                        <FormTextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={strings.PASSWORD_PLACEHOLDER}
                            secureTextEntry={true}
                        />
                        <View style={styles.button}><Button title={strings.LOGIN}
                            onPress={this.handleLoginPress} /></View>
                    </View>
                </KeyboardAvoidingView>
                <View style={styles.buttons}>
                    {Platform.OS === 'ios'
                        ? <TouchableOpacity onPress={this.handleFacebookLoginPress}>
                            {renderFacebookButton()}
                        </TouchableOpacity>
                        : <TouchableNativeFeedback onPress={this.handleFacebookLoginPress}>
                            {renderFacebookButton()}
                        </TouchableNativeFeedback>}
                    {Platform.OS === 'ios'
                        ? <TouchableOpacity onPress={this.handleGoogleLoginPress}>
                            {renderGoogleButton()}
                        </TouchableOpacity>
                        : <TouchableNativeFeedback onPress={this.handleGoogleLoginPress} useForeground={true}>
                            {renderGoogleButton()}
                        </TouchableNativeFeedback>}
                    {
                        __DEV__
                            ?
                            <View style={{ marginTop: 10 }}>
                                <Button title={"[DEV] Take me in"}
                                    onPress={() => this.props.navigation.navigate('Main')}
                                    color={"red"} />
                            </View>
                            :
                            <View />
                    }
                </View>
            </View>
        );
    }
}

function renderFacebookButton() {
    return (
        <View style={styles.facebook}>
            <Image
                source={require('../assets/images/facebook.png')}
                style={styles.iconStyle}
            />
            <View style={styles.separatorFacebook} />
            <Text style={styles.textFacebook}> {strings.FACEBOOK_LOG_IN} </Text>
        </View>
    );
}

function renderGoogleButton() {
    return (
        <View style={styles.google}>
            <Image
                source={require('../assets/images/google.png')}
                style={styles.iconStyle}
            />
            <View style={styles.separatorGoogle} />
            <Text style={styles.textGoogle}> {strings.GOOGLE_LOG_IN} </Text>
        </View>
    )
}

function saveLogin(jwt, userId) {
    console.log(`Saving login with ${jwt} and id ${userId}`);
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
        flex: 1,
        resizeMode: "contain",
        alignSelf: "center",
        width: "60%",
        marginTop: "10%"
    },
    form: {
        flex: 1,
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
    buttons: {
        flex: 1,
        justifyContent: "center",
        width: "75%",
        marginBottom: "5%"
    },
    button: {
        borderRadius: 5,
        height: 40,
    },
    facebook: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4267B2',
        borderWidth: 0.5,
        borderColor: '#fff',
        height: 40,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    google: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#00005F',
        height: 40,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5
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
        fontFamily: 'Roboto_medium',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    textGoogle: {
        color: "#000000",
        fontSize: 16,
        fontFamily: 'Roboto_medium',
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
