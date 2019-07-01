import React, {Component} from 'react';
import {Button, ScrollView, StyleSheet, View, Switch, Platform} from 'react-native';
import strings from "../values/Strings";
import {Avatar, ListItem, Text} from "react-native-elements";
import InfoText from '../components/InfoText'
import BaseIcon from '../components/BaseIcon'
import Chevron from '../components/Chevron'
import {SafeAreaView} from "react-navigation";

export default class ProfileScreen extends Component {

    state = {
        pushNotifications: true,
    };

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
                            <Text style={{fontSize: 16}}>Tu Nguyen</Text>
                            <Text
                                style={{
                                    color: 'gray',
                                    fontSize: 16,
                                }}
                            >
                                tunmse63006@fpt.edu.vn
                            </Text>
                        </View>
                    </View>
                    <InfoText text="Account"/>
                    <View>
                        <ListItem
                            hideChevron
                            title="Push Notifications"
                            containerStyle={styles.listItemContainer}
                            rightElement={
                                <Switch
                                    onValueChange={this.onChangePushNotifications}
                                    value={this.state.pushNotifications}
                                />
                            }
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
                            title="Currency"
                            rightTitle="USD"
                            rightTitleStyle={{fontSize: 15}}
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
                            title="Location"
                            rightTitle="New York"
                            rightTitleStyle={{fontSize: 15}}
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
                            title="Language"
                            rightTitle="English"
                            rightTitleStyle={{fontSize: 15}}
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
                    <InfoText text={"Settings"}/>
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
