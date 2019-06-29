import React, {Component} from "react";
import { Image, StyleSheet, View, Button } from "react-native";
import strings from '../res/Strings'
import colors from '../res/Colors'
import FormTextInput from "../components/FormTextInput";
import * as SecureStore from 'expo-secure-store';

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
        SecureStore.setItemAsync('email', email, {
            keychainAccessible: SecureStore.ALWAYS
        });
        SecureStore.setItemAsync('password', password, {
            keychainAccessible: SecureStore.ALWAYS
        });
        this.props.navigation.navigate( 'Main');
    };

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <View style={styles.form}>
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
                    <Button title={strings.LOGIN} onPress={this.handleLoginPress} />
                </View>
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
        flex: 1,
        resizeMode: "contain",
        alignSelf: "center"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
    }
});

export default LoginScreen;