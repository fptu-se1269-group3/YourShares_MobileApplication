import React, {Component} from 'react';
import {View, Button, FlatList, StyleSheet, ToastAndroid} from "react-native";
import moment from "moment";
import {Body, Card, CardItem, Text, Left, Right} from "native-base";
import colors from "../values/Colors";
import Modal from "react-native-modal";
import {Avatar} from "react-native-elements";
import Numeral from "numeral";

export default class RoundScreen extends Component {
    static navigationOptions = {
        title: 'Rounds'
    };

    constructor(props) {
        super(props);
        this.state = {
            rounds: props.navigation.getParam('rounds'),
            selectedRound: '',
            roundInvestors: [],
            isModalVisible: false,
        }
    }

    _renderRoundItem = ({item}) => {
        return (
            <Card>
                <CardItem bordered style={{borderWidth: 1}} button
                          onPress={() => {
                              if (item.roundInvestors.length > 0) {
                                  this.setState({selectedRound: item.name});
                                  this.setState({roundInvestors: item.roundInvestors});
                                  this.setState({isModalVisible: true});
                              } else {
                                  ToastAndroid.show('No individual investors', ToastAndroid.LONG);
                              }
                          }}>
                    <Body style={{alignItems: 'space-between'}}>
                        <Text style={{color: colors.TEXT_COLOR, alignSelf: 'flex-start', paddingBottom: '2%'}}>
                            {this._formatDate(item.roundDate)}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1, alignSelf: 'flex-start'}}>
                                {item.name}
                            </Text>
                            <Text style={{textAlign: 'right', flex: 1, alignSelf: 'flex-end', color: 'green'}}>
                                Money raised {this._formatCurrency(item.moneyRaised)}
                            </Text>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        );
    };

    _formatPercentage = (val) => Numeral(val/100).format('0.[000]%');

    _formatCurrency = (val) => Numeral(val).format('($0.[00] a)').toUpperCase();

    _formatVolume = (val) => Numeral(val).format('0.[00] a').toUpperCase();

    // from unix timestamp
    _formatDate = (val) => moment.unix(val).format('MMM. DD YYYY');

    _renderInvestorItem = ({item}) => {
        return (
            <Card style={{borderRadius: 10}} pointerEvents="none">
                <CardItem header bordered style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Avatar size={"medium"} source={{uri: item.photoUrl}}/>
                        <View style={{paddingLeft: "5%", justifyContent: 'space-between'}}>
                            <Text>
                                {item.investorName}
                            </Text>
                            <Text style={{color: 'green'}}>
                                Invested {this._formatCurrency(item.investedValue)} for {this._formatVolume(item.shareAmount)}({this._formatPercentage(item.sharesHoldingPercentage)}) shares
                            </Text>
                        </View>
                    </View>
                </CardItem>
            </Card>
        );
    };

    _hideModal = () => {
        this.setState({isModalVisible: false})
    };

    render() {
        return (
            <View>
                <FlatList keyExtractor={item => item.roundId}
                          data={this.state.rounds}
                          renderItem={this._renderRoundItem}
                />
                <Modal style={styles.bottomModal}
                       isVisible={this.state.isModalVisible}
                       swipeDirection={['up', 'down', 'left', 'right']}
                       onSwipeComplete={this._hideModal}
                       onBackButtonPress={this._hideModal}
                       hasBackdrop={true}
                       onBackdropPress={this._hideModal}
                       hideModalContentWhileAnimating={true}

                >
                    <View style={styles.content}>
                        <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>{this.state.selectedRound} investors</Text>
                        <FlatList keyExtractor={item => item.roundInvestorId}
                                  data={this.state.roundInvestors}
                                  renderItem={this._renderInvestorItem}
                        />
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    }
});