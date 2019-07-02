import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, View, Switch, Platform } from 'react-native';
import strings from "../values/Strings";
import { Avatar, ListItem, Text } from "react-native-elements";
import PropTypes from 'prop-types';
import InfoText from '../components/InfoText'
import { SafeAreaView } from "react-navigation";
import * as SecureStore from 'expo-secure-store';
import BaseIcon from '../components/BaseIcon'
import Chevron from '../components/Chevron'

export default class ProfileScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            pushNotifications: true,
            jwt: '',
            userId: '',
            email: '',
            name: '',
            phone: '',
            address: ''
        };
    }

    componentDidMount() {
        this.getTokenAsyn()
            .then(jwt => {
                this.setState({ jwt });
            });
        this.getUserIdAsyn()
            .then(userId => {
                this.setState({ userId })
                console.log(this.state.userId);
                this.callApi();
            })
    }

    callApi() {
        fetch(`http://api.yourshares.tk/api/user/${this.state.userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.jwt}`
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    email: responseJson['data'].email,
                    name: responseJson['data'].name,
                    phone: responseJson['data'].phone,
                    address: responseJson['data'].address
                })
            })
            .catch((error) => {
                alert(error);
            });
    }

    getTokenAsyn() {
        return SecureStore.getItemAsync('jwt')
            .then(jwt => { return jwt })
            .catch(error => console.log(error));
    }
    getUserIdAsyn() {
        return SecureStore.getItemAsync('id')
            .then(userId => { return userId })
            .catch(error => console.log(error));
    }

    onPressOptions = () => {
        alert('Pressed');
    };

    onChangePushNotifications = () => {
        this.setState(state => ({
            pushNotifications: !state.pushNotifications,
        }))
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.userRow}>
                        <View style={styles.userImage}>
                            <Avatar
                                rounded
                                size="medium"
                                source={
                                    require('../assets/images/photo.png')
                                }
                            />
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>{this.state.name}</Text>
                            <Text
                                style={{
                                    color: 'gray',
                                    fontSize: 16,
                                }}
                            >
                                {this.state.email}
                            </Text>
                        </View>
                    </View>
                    <InfoText text="Account" />
                    <View>
                        <ListItem
                            title="Email"
                            rightTitle={this.state.email}
                            rightTitleStyle={{ fontSize: 15 }}
                            onPress={() => this.onPressOptions()}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{
                                        backgroundColor: '#FFADF2',
                                    }}
                                    icon={{
                                        type: 'material',
                                        name: 'notifications',
                                    }}
                                />
                            }
                        />
                        <ListItem
                            title="Name"
                            rightTitle={this.state.name}
                            rightTitleStyle={{ fontSize: 15 }}
                            onPress={() => this.onPressOptions()}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{ backgroundColor: '#FAD291' }}
                                    icon={{
                                        type: 'font-awesome',
                                        name: 'money',
                                    }}
                                />
                            }
                            rightIcon={<Chevron />}
                        />
                        <ListItem
                            title="Address"
                            rightTitle={this.state.address}
                            rightTitleStyle={{ fontSize: 15 }}
                            onPress={() => this.onPressOptions()}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{ backgroundColor: '#57DCE7' }}
                                    icon={{
                                        type: 'material',
                                        name: 'place',
                                    }}
                                />
                            }
                            rightIcon={<Chevron />}
                        />
                        <ListItem
                            title="Phone"
                            rightTitle={this.state.phone}
                            rightTitleStyle={{ fontSize: 15 }}
                            onPress={() => this.onPressOptions()}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{ backgroundColor: '#FEA8A1' }}
                                    icon={{
                                        type: 'material',
                                        name: 'language',
                                    }}
                                />
                            }
                            rightIcon={<Chevron />}
                        />
                    </View>
                    <InfoText text={"Settings"} />
                    <View style={styles.button} >
                        <Button
                            title={strings.LOGOUT}
                            onPress={() => this.props.navigation.navigate('Auth')}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

ProfileScreen.navigationOptions = {
    title: 'User profile',
};

ProfileScreen.headerMode = 'none';

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
