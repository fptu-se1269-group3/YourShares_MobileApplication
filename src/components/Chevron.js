import React from 'react'
import { Icon } from 'react-native-elements'
import colors from '../values/Colors'

const Chevron = () => (
    <Icon
        name="chevron-right"
        type="entypo"
        color={colors.LIGHT_GREY}
        containerStyle={{ marginLeft: -15, width: 20 }}
    />
);

export default Chevron