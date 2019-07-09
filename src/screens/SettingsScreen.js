import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, View, Switch, Platform, TextInput } from 'react-native';
import strings from "../values/Strings";
import { Avatar, ListItem, Text } from "react-native-elements";
import InfoText from '../components/InfoText'
import { SafeAreaView } from "react-navigation";
import * as SecureStore from 'expo-secure-store';
import BaseIcon from '../components/BaseIcon';
import Chevron from '../components/Chevron';
import color from "../values/Colors";
import * as LocalAuthentication from 'expo-local-authentication';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushNotifications: global["isfingersprintAuth"] == "1" ? true : false
        };
    }
    static navigationOptions = {
        title: "Settings"
    };

    async componentDidMount() {
        await (Promise.all([SecureStore.getItemAsync('isfingersprintAuth')])
            .then((isfingersprintAuth) => {
                global["isfingersprintAuth"] = isfingersprintAuth;
            }));
    }

    async saveData(pushNotifications) {
        await SecureStore.setItemAsync('isfingersprintAuth', pushNotifications, {
            keychainAccessible: SecureStore.ALWAYS
        });
    }

    async onChangePushNotifications() {
        if (this.state.pushNotifications) {
            this.setState({
                pushNotifications: false
            })
            await this.saveData("0");
            alert("Done");
        } else {
            var check = await LocalAuthentication.hasHardwareAsync()
            if(check){
                this.setState({
                    pushNotifications: true
                })
                await this.saveData("1");
                alert("Done");
            }else{
                alert("Device Not Support Fingersprint");
            }
            
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <InfoText text="Security Account" />
                    <View>
                        <ListItem
                            title="Change Password"
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            containerStyle={styles.listItemContainer}
                            rightIcon={<Chevron />}
                        />
                        <ListItem
                            hideChevron
                            title="Fingerprint Auth"
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            containerStyle={styles.listItemContainer}
                            rightElement={
                                <Switch
                                    onValueChange={() => this.onChangePushNotifications()}
                                    value={this.state.pushNotifications}
                                />
                            }
                        />
                    </View>
                    <InfoText text="Other" />
                    <View>
                        <ListItem
                            title="Language"
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            rightTitleStyle={{ fontSize: 15, width: 220, textAlign: 'right' }}
                            rightTitle="English"
                            containerStyle={styles.listItemContainer}
                            rightIcon={<Chevron />}
                        />
                        <ListItem
                            title="Notification"
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            containerStyle={styles.listItemContainer}
                            rightIcon={<Chevron />}
                        />
                        <ListItem
                            title="Application Info"
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            containerStyle={styles.listItemContainer}
                            onPress={() => navigation.navigate('QRScan')}
                            rightIcon={<Chevron />}
                        />
                    </View>
                    <View style={styles.button} >
                        <Button
                            title={strings.LOGOUT}
                            onPress={() => navigation.navigate('Auth')}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    scroll: {
        backgroundColor: "#F4F5F4",
        flex: 1
    },
    userRow: {
        backgroundColor: "#ffffff",
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
    },
    userImage: {
        marginRight: 12,
    },
    listItemContainer: {
        height: 55,
        borderWidth: 0.5,
        borderColor: '#ECECEC',
    },
    button: {
        marginTop: 12,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
});
