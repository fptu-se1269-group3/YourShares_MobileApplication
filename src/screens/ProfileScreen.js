import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, View, Switch, Platform, TextInput } from 'react-native';
import strings from "../values/Strings";
import {Avatar, ListItem, Text} from "react-native-elements";
import InfoText from '../components/InfoText'
import {SafeAreaView} from "react-navigation";
import BaseIcon from '../components/BaseIcon';
import Chevron from '../components/Chevron';
import color from "../values/Colors";

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            photoUrl: null,
        };
    }

    static navigationOptions = {
        title: "Profile"
    };

    componentDidMount() {
        this.getInfo();
    }

    getInfo() {
        fetch(`http://api.yourshares.tk/api/users/${global["userId"]}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global["jwt"]}`
            },
        }).then((response) => {
            return response.json()})
            .then((responseJson) => {
                this.setState({
                    email: responseJson['data'].email,
                    firstName: responseJson['data'].firstName,
                    lastName: responseJson['data'].lastName,
                    phone: responseJson['data'].phone,
                    address: responseJson['data'].address,
                    photoUrl: responseJson['data'].photoUrl
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    editInfo(field, editField) {
        console.log(field + " " + editField);
        fetch(`http://api.yourshares.tk/api/users/${field}?value=${editField}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global["jwt"]}`
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
                console.error(error);
            });
    }

    render() {
        const {navigation} = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.userRow}>
                        <View style={styles.userImage}>
                            {this.state.photoUrl === null
                                ? <Avatar rounded size={"medium"} source={require('../assets/images/photo.png')}/>
                                : <Avatar rounded size={"medium"} source={{uri: this.state.photoUrl}}/>
                            }
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
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            rightTitleStyle={{ fontSize: 16, width: 220 ,textAlign:'right'}}
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
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            rightTitle={
                                <TextInput style={{ width: 220, textAlign: 'right' }}
                                    defaultValue={this.state.firstName}
                                    onSubmitEditing={(evn) => this.editInfo('firstName', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{ fontSize: 16, width: 220 }}
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
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            rightTitle={
                                <TextInput style={{ width: 220, textAlign: 'right' }}
                                    defaultValue={this.state.lastName}
                                    onSubmitEditing={(evn) => this.editInfo('lastName', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{ fontSize: 16, width: 220 }}
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
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            rightTitle={
                                <TextInput style={{ width: 220, textAlign: 'right' }}
                                    defaultValue={this.state.phone}
                                    onSubmitEditing={(evn) => this.editInfo('phone', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{ fontSize: 16, width: 220 }}
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
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            rightTitle={this.state.address}
                            rightTitleStyle={{ fontSize: 16 }}
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
                        <InfoText text={"Settings"}/>
                        <ListItem
                            title="App settings"
                            titleStyle={{ fontSize: 16, color: color.TEXT_COLOR }}
                            containerStyle={styles.listItemContainer}
                            onPress={() => navigation.push('Settings')}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{ backgroundColor: '#57DCE7' }}
                                    icon={{
                                        type: 'Feather',
                                        name: 'settings',
                                    }}
                                />
                            }
                            rightIcon={<Chevron/>}
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
