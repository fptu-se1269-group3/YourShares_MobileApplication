import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TransactionsScreen from "../screens/TransactionsScreen";

const config = Platform.select({
    web: {headerMode: 'screen'},
    default: {},
});

const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
    },
    config
);

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            type={'ionic'}
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? 'ios-home'
                    : 'md-home'
            }
        />
    ),
};

// HomeStack.path = '';

const ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreen,
    },
    config
);

ProfileStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            type={'material'}
            focused={focused}
            name={'account-circle'}
        />
    ),
};

// LinksStack.path = '';

const SettingsStack = createStackNavigator(
    {
        Settings: SettingsScreen,
    },
    config
);

SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            type={'ionic'}
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
        />
    ),
};

const TransactionStack = createStackNavigator(
    {
        Transactions: TransactionsScreen
    }, {
        navigationOptions: {
            tabBarLabel: 'Transactions',
            tabBarIcon: ({focused}) => (
                <TabBarIcon
                    type={'materialcom'}
                    focused={focused}
                    name={'bank-transfer'}/>
            )
        }
    }
);

// SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
    HomeStack,
    TransactionStack,
    ProfileStack,
    SettingsStack,
});

// tabNavigator.path = '';

export default tabNavigator;
