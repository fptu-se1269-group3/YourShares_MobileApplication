import React from 'react';
import {View, Text} from "react-native";

export default function SettingsScreen() {
    /**
     * Go ahead and delete ExpoConfigView and replace it with your content;
     * we just wanted to give you a quick view of your config.
     */
    return (
        <View>
            <Text>
                Your're at settings tab
            </Text>
        </View>
    )
}

SettingsScreen.navigationOptions = {
    title: 'Settings',
    headerMode: 'none'
};
