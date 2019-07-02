import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function InfoText(props) {
    const {text} = props;
    return (
        <View style={styles.container}>
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 12,
        backgroundColor: '#F4F5F4',
    },
    infoText: {
        fontSize: 16,
        marginLeft: 20,
        color: 'gray',
        fontWeight: '500',
    },
});

