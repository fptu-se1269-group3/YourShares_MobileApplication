import React, {Component} from 'react';
import { StyleSheet, Button} from 'react-native';
import {SafeAreaView} from "react-navigation";

export class HomeScreen extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <SafeAreaView style={styles.container}>
                <Button
                    title={"Go to Login"}
                    onPress={() => navigate('Login')}
                />
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        justifyContent: 'space-between',
        // justifyContent: 'center',
    },
    paragraph: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
});