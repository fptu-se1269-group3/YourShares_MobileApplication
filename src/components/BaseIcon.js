import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function BaseIcon(props) {
    const { ...icon } = props;
    return (
        <View style={[styles.container, props.containerStyle]}>
            <Icon
                size={24}
                color="white"
                type="material"
                name="notifications"
                {...icon}
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
        height: 34,
        justifyContent: 'center',
        marginLeft: 5,
        marginRight: 7,
        width: 34,
    },
});
