import React from 'react';
import {createAppContainer} from 'react-navigation';
import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
import {Transition} from "react-native-reanimated";

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator'

export default createAppContainer(
    createAnimatedSwitchNavigator({
        Auth: AuthNavigator,
        Main: MainTabNavigator
    }, {
        initialRouteName: 'Auth',
        transition: (
            <Transition.Together>
                <Transition.Out
                    type="slide-bottom"
                    durationMs={400}
                    interpolation="easeIn"
                />
                <Transition.In type="fade" durationMs={500} />
            </Transition.Together>
        )
    })
);
