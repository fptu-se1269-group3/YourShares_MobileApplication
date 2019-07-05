import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function BaseIcon(props) {
    return (
        <View style={[styles.container, props.containerStyle]}>
            <Icon
                size={22}
                color={"white"}
                {...props.icon}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'black',
        borderColor: 'transparent',
        borderRadius: 10,
        borderWidth: 1,
        height: 32,
        justifyContent: 'center',
        marginLeft: 0,
        marginRight: 0,
        width: 32,
    },
});
