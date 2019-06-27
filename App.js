import React from 'react';
import { Platform } from 'react-native';
import MainNavigator from './src/navigations/MainNavigator'

if (Platform.OS === 'android') {
    console.log('Detected android')
}

import {createAppContainer} from 'react-navigation';

const App = createAppContainer(MainNavigator);

export default App;
