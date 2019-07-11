import React, {Component} from 'react';
import {View, Text, Button, FlatList, Modal} from "react-native";
import moment from "moment";
import {Body, Card, CardItem} from "native-base";
import colors from "../values/Colors";

export default class RoundScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rounds: props.navigation.getParam('rounds'),
            showModal: false,
        }
    }

    _renderModal = () => {
        return (
            <Modal visible={this.state.showModal}
                   transparent={true}
                   onRequestClose={() => this.setState({showModal: false})}
                   animationType={"slide"}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        height: "85%",
                        width: "100%",
                        backgroundColor: "red",
                        alignItems: 'flex-end',
                    }}
                    >
                        <Button title={"Close"} onPress={() => this.setState({showModal: false})}/>
                        <FlatList keyExtractor={item => item.roundId}
                                  data={this.state.rounds}
                                  renderItem={this._renderItem}
                        />
                    </View>
                </View>
            </Modal>
        );
    };

    _renderItem = ({item}) => {
        return (
            <Card pointerEvents="none" >
                <CardItem bordered style={{borderWidth:1}}>
                    <Body>
                        <Text style={{ textAlign: 'right', alignSelf: 'flex-end', color: colors.TEXT_COLOR }}>
                            {item.moneyRaised}
                        </Text>
                        <Text style={{ position: 'relative', top: -14, color: colors.TEXT_COLOR }}>
                            {this._formatDate(item.roundDate)}
                        </Text>
                        <Text style={{ position: 'absolute', bottom: 3, fontSize: 15.5, color: colors.TEXT_COLOR }}>
                            {item.name}
                        </Text>
                        <Text style={{textAlign: 'right', alignSelf: 'flex-end' }}>
                            {item.moneyRaised}
                        </Text>
                    </Body>
                </CardItem>
            </Card>
        );
    };

    _formatDate = (val) => moment(val).format('MMM. DD YYYY');

    render() {
        return (
            <View>
                <FlatList keyExtractor={item => item.roundId}
                          data={this.state.rounds}
                          renderItem={this._renderItem}
                />
            </View>
        );
    }
}