import React, {Component} from 'react';
import {Button, ScrollView, StyleSheet} from 'react-native';
import strings from "../res/Strings";

export default class ProfileScreen extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                < Button
                    title={strings.LOGOUT}
                    onPress={() => this.props.navigation.navigate('Auth')}
                />
            </ScrollView>
        );
    }
}

ProfileScreen.navigationOptions = {
    title: 'User profile',
    headerMode: 'none'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});
