import React, { Component } from 'react';
import QRCode from 'react-native-qrcode';
import StringValue from '../values/Strings';

import { StyleSheet, View, TextInput } from 'react-native';

export default class QRScreen extends Component {
  state = {
    text: 'Scan to request Transaction',
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({text: text})}
          value={this.state.text}
        />
        <QRCode
          value={StringValue.PREFIX_QR +"+"+ global["userId"]}
          size={200}
          bgColor='black'
          fgColor='white'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
        padding: 5,
    }
});