import React from 'react';
import {View, StatusBar, Platform} from 'react-native';
import colors from '../values/Colors';

export default function () {
        return (
            <View style={{backgroundColor: colors.STATUS_BAR_DARK_BLUE, height: 20}}>
                <StatusBar translucent backgroundColor={colors.STATUS_BAR_DARK_BLUE} barStyle={'light-content'} />
            </View>
        )
}