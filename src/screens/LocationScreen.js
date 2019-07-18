import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SearchBar } from 'react-native-elements'
import colors from "../values/Colors";
import { Card, CardItem } from "native-base";
import { Icon } from 'react-native-elements'
import {updateUser} from "../services/UserService";

export default class LocationScreen extends Component {
    state = {
        location: null,
        errorMessage: null,
        dataReturn: null,
        search:this.props.navigation.getParam('address'),
    };

    async componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            await this._getLocationAsync();
            await this._attemptReverseGeocodeAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({
            dataReturn: { latitude: location.coords.latitude, longitude: location.coords.longitude }
        })
    };

    _attemptReverseGeocodeAsync = async () => {

        try {
            let result = await Location.reverseGeocodeAsync(
                this.state.dataReturn
            );
            this.setState({ location: result });
        } catch (e) {
            this.setState({ error: e });
        }
    };

    handlePress(text) {
        const {navigation} = this.props;
        updateUser('address', text, global["jwt"])
            .then((response) => response.json())
            .then((responseJson) => { })
            .catch((error) => {
                console.error(error);
            });
        navigation.navigate('Profile',{props:'change'})
    }

    render() {
        let text = 'Waiting..';
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            text = this.state.location[0].city + ", " + this.state.location[0].country;
        }

        return (
            <View style={styles.container}>
                {Platform.OS === 'ios'}
                <SearchBar
                    platform={Platform.OS === 'ios' ? "ios" : "android"}
                    placeholder={"Input Your Location ..."}
                    containerStyle={{ backgroundColor: colors.HEADER_LIGHT_BLUE }}
                    onChangeText={(search) => {
                        this.setState({ search });
                    }}
                    onSubmitEditing={() => this.handlePress(this.state.search)}
                    value={this.state.search}
                />
                <Card style={{ borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => this.handlePress(text)}>
                        <CardItem header bordered style={{ borderRadius: 10 }}>
                            <Icon name='edit-location' />
                            <Text style={{ color: 'blue' }}>
                                {text}
                            </Text>
                        </CardItem>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
});