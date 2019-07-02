import React, {Component} from "react";
import { Avatar, ListItem, Text } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { Button, ScrollView, StyleSheet, View, Switch, Platform } from 'react-native';
import InfoText from '../components/InfoText'

export default class TransactionsScreen extends Component{
    render() {
        return (
            <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll}>
                <View>
                    <ListItem
                        title="Company"
                        rightTitle="name"
                        rightTitleStyle={{ fontSize: 15 }}
                        onPress={() => alert('onpress')}
                        containerStyle={styles.listItemContainer}
                    // leftIcon={
                    //     <BaseIcon
                    //         containerStyle={{ backgroundColor: '#FAD291' }}
                    //         icon={{
                    //             type: 'font-awesome',
                    //             name: 'money',
                    //         }}
                    //     />
                    // }
                    // rightIcon={<Chevron />}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
        );
    }
}


TransactionsScreen.navigationOptions = {
    title: 'Transactions'
};

const styles = StyleSheet.create({
    container: {
        marginTop: (Platform.OS === 'ios') ? 0 : 22,
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        backgroundColor: 'white',
        flex: 1
    },
    userRow: {
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
    }
});