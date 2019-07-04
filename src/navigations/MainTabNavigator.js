import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TransactionsScreen from "../screens/TransactionsScreen";
import colors from "../values/Colors";
import CompanyDetailScreen from "../screens/CompanyDetailScreen";

const config = Platform.select({
    web: {headerMode: 'screen'},
    default: {
        defaultNavigationOptions: {
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: colors.HEADER_LIGHT_BLUE

            },
        }
    },
});

const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
        Company: CompanyDetailScreen
    },
    config
);

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    header: null,
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


const ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreen,
        Settings: SettingsScreen
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


const TransactionsStack = createStackNavigator(
    {
        Transactions: TransactionsScreen
    },
    config
);

TransactionsStack.navigationOptions = {
    tabBarLabel: 'Transactions',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            type={'materialcom'}
            focused={focused}
            name={'bank-transfer'}/>
    )
};


const tabNavigator = createBottomTabNavigator({
    Home: HomeStack,
    Transactions: TransactionsStack,
    Profile: ProfileStack,
}, {
    initialRouteName: 'Home'
});

export default tabNavigator;
