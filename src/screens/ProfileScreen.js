import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, View, Switch, Platform, TextInput } from 'react-native';
import strings from "../values/Strings";
import {Avatar, ListItem, Text} from "react-native-elements";
import InfoText from '../components/InfoText'
import {SafeAreaView} from "react-navigation";
import * as SecureStore from 'expo-secure-store';
import BaseIcon from '../components/BaseIcon';
import Chevron from '../components/Chevron';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushNotifications: true,
            jwt: '',
            userId: '',
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: ''
        };
    }

    static navigationOptions = {
        title: "Profile"
    };

    // TODO this cause memory leak, fix this
    componentDidMount() {
        this.getTokenAsync()
            .then(jwt => {
                this.setState({jwt});
            });
        this.getUserIdAsync()
            .then(userId => {
                this.setState({userId});
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
                    firstName: responseJson['data'].firstName,
                    lastName: responseJson['data'].lastName,
                    phone: responseJson['data'].phone,
                    address: responseJson['data'].address
                })
            })
            .catch((error) => {
                alert(error);
            });
    }

    editInfo(field, editField) {
        console.log(field + " " + editField);
        fetch(`http://api.yourshares.tk/api/users/${field}?value=${editField}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.jwt}`
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    email: responseJson['data'].email,
                    firstName: responseJson['data'].firstName,
                    lastName: responseJson['data'].lastName,
                    phone: responseJson['data'].phone,
                    address: responseJson['data'].address
                })
            })
            .catch((error) => {
                alert(error);
            });
    }

    getTokenAsync() {
        return SecureStore.getItemAsync('jwt')
            .then(jwt => {
                return jwt
            })
            .catch(error => console.error(error));
    }

    getUserIdAsync() {
        return SecureStore.getItemAsync('id')
            .then(userId => {
                return userId
            })
            .catch(error => console.error(error));
    }

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
                            <Text style={{ fontSize: 16 }}>{this.state.firstName} {this.state.lastName}</Text>
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
                    <InfoText text={"Account"}/>
                    <View>
                        <ListItem
                            title="Email"
                            rightTitle= {this.state.email}
                            rightTitleStyle={{ fontSize: 15, width: 220 ,textAlign:'right'}}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{
                                        backgroundColor: '#FFADF2',
                                    }}
                                    icon={{
                                        type: 'Entypo',
                                        name: 'email',
                                    }}
                                />
                            }
                        />
                        <ListItem
                            title="FirstName"
                            rightTitle={
                                <TextInput style={{ width: 220, textAlign: 'right' }}
                                    defaultValue={this.state.firstName}
                                    onSubmitEditing={(evn) => this.editInfo('firstName', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{ fontSize: 15, width: 220 }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{backgroundColor: '#FAD291'}}
                                    icon={{
                                        type: 'Entypo',
                                        name: 'info',
                                    }}
                                />
                            }
                        />
                        <ListItem
                            title="LastName"
                            rightTitle={
                                <TextInput style={{ width: 220, textAlign: 'right' }}
                                    defaultValue={this.state.lastName}
                                    onSubmitEditing={(evn) => this.editInfo('lastName', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{ fontSize: 15, width: 220 }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{ backgroundColor: '#15b046' }}
                                    icon={{
                                        type: 'Entypo',
                                        name: 'info',
                                    }}
                                />
                            }
                        />
                        <ListItem
                            title="Phone"
                            rightTitle={
                                <TextInput style={{ width: 220, textAlign: 'right' }}
                                    defaultValue={this.state.phone}
                                    onSubmitEditing={(evn) => this.editInfo('phone', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{ fontSize: 15, width: 220 }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{backgroundColor: '#FEA8A1'}}
                                    icon={{
                                        type: 'FontAwesome',
                                        name: 'phone',
                                    }}
                                />
                            }
                        />
                        <ListItem
                            title="Address"
                            rightTitle={this.state.address}
                            rightTitleStyle={{ fontSize: 15 }}
                            containerStyle={styles.listItemContainer}
                            onPress={() => alert('click')}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{ backgroundColor: '#57DCE7' }}
                                    icon={{
                                        type: 'material',
                                        name: 'place',
                                    }}
                                />
                            }
                            rightIcon={<Chevron/>}
                        />

                    </View>
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
