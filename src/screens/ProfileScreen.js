import React, {Component} from 'react';
import {Button, ScrollView, StyleSheet, View, Switch, Platform, TextInput, TouchableHighlight} from 'react-native';
import {Avatar, Icon, ListItem, Text} from "react-native-elements";
import InfoText from '../components/InfoText'
import {AntDesign,Ionicons} from "@expo/vector-icons";
import BaseIcon from '../components/BaseIcon';
import Chevron from '../components/Chevron';
import colors from "../values/Colors";
import {getUser, updateUser} from "../services/UserService";

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
    componentDidUpdate(){
        this.getInfo()
    }
    static navigationOptions = ({navigation}) => ({
        title: 'Profile',
        headerRight: (
            <TouchableHighlight underlayColor={colors.DODGER_BLUE}
                                onPress={() => navigation.navigate('QRScan')}
                                delayPressIn={0}
                                delayPressOut={0}
            >
                <Ionicons style={{marginRight:10}} name={'md-qr-scanner'} size={30}/>
            </TouchableHighlight>
        )
    });

    componentDidMount() {
        this.getInfo();
    }

    getInfo() {
        getUser(global["userId"], global["jwt"])
            .then(response => response.json())
            .then(responseJson => {
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
        updateUser(field, editField, global["jwt"])
            .then((response) => response.json())
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
            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.userRow}>
                        <View style={styles.userImage}>
                            {this.state.photoUrl === null
                                ? <Avatar rounded size={"medium"} source={require('../assets/images/photo.png')}/>
                                : <Avatar rounded size={"medium"} source={{uri: this.state.photoUrl}}/>
                            }
                        </View>
                        <View>
                            <Text style={{fontSize: 16}}>{this.state.firstName} {this.state.lastName}</Text>
                            <Text style={{
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
                            rightTitle={this.state.email}
                            titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                            rightTitleStyle={{fontSize: 16, width: 220, textAlign: 'right'}}
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
                            titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                            rightTitle={
                                <TextInput style={{width: 220, textAlign: 'right'}}
                                           defaultValue={this.state.firstName}
                                           onSubmitEditing={(evn) => this.editInfo('firstName', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{fontSize: 16, width: 220}}
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
                            titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                            rightTitle={
                                <TextInput style={{width: 220, textAlign: 'right'}}
                                           defaultValue={this.state.lastName}
                                           onSubmitEditing={(evn) => this.editInfo('lastName', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{fontSize: 16, width: 220}}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{backgroundColor: '#15b046'}}
                                    icon={{
                                        type: 'Entypo',
                                        name: 'info',
                                    }}
                                />
                            }
                        />
                        <ListItem
                            title="Phone"
                            titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                            rightTitle={
                                <TextInput style={{width: 220, textAlign: 'right'}}
                                           defaultValue={this.state.phone}
                                           onSubmitEditing={(evn) => this.editInfo('phone', evn.nativeEvent.text)}
                                />
                            }
                            rightTitleStyle={{fontSize: 16, width: 220}}
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
                            titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                            rightTitle={this.state.address}
                            rightTitleStyle={{fontSize: 16}}
                            onPress={() => navigation.navigate('LocationScreen',{address:this.state.address})}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{backgroundColor: '#57DCE7'}}
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
                            title="My QR Code"
                            titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                            containerStyle={styles.listItemContainer}
                            onPress={() => navigation.navigate('QRScreen')}
                            leftIcon={
                                <AntDesign name={'qrcode'} size={30}/>
                            }
                            rightIcon={<Chevron/>}
                        />
                        <ListItem
                            title="App settings"
                            titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                            containerStyle={styles.listItemContainer}
                            onPress={() => navigation.push('Settings')}
                            leftIcon={
                                <BaseIcon
                                    containerStyle={{backgroundColor: '#57DCE7'}}
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
            </View>
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
});
