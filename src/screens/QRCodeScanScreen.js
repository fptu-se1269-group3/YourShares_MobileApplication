import * as React from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class BarcodeScannerExample extends React.Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    };

    render() {
        const { hasCameraPermission, scanned } = this.state;


        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        }
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
        );
    }

    handleBarCodeScanned = ({ type, data }) => {
        const { navigation } = this.props;
        this.setState({ scanned: true });
        Alert.alert(
            'Request transaction with Id ?',
            data,
            [
                {
                    text: 'Yes',
                    onPress: () => navigation.navigate('RequestTransaction', { Id: data }),
                    //onPress: () => Linking.openURL(this.state.lastScannedUrl),
                },
                { text: 'No', onPress: () => this.setState({ scanned: false }) },
            ],
            { cancellable: false }
        );
    };
}