import React from 'react';
import {Ionicons, MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';

import colors from '../values/Colors';

export default function TabBarIcon(props) {
    switch (props.type) {
        case 'ionic':
            return (
                <Ionicons
                    name={props.name}
                    size={26}
                    style={{marginBottom: -3}}
                    color={props.focused ? colors.tabIconSelected : colors.tabIconDefault}
                />
            );
        case 'material':
            return (
                <MaterialIcons
                    name={props.name}
                    size={26}
                    style={{marginBottom: -3}}
                    color={props.focused ? colors.tabIconSelected : colors.tabIconDefault}
                />
            );
        case 'materialcom':
            return (
                <MaterialCommunityIcons
                    name={props.name}
                    size={26}
                    style={{marginBottom: -3}}
                    color={props.focused ? colors.tabIconSelected : colors.tabIconDefault}
                />
            )
    }

}
