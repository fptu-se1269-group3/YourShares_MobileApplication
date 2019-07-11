import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native'
import {Body, Card, CardItem, Left, Right, Text} from "native-base";
import {getRoundByCompany} from "../services/RoundServices";
import {getRoundInvestorByRound} from "../services/RoundInvestorService";
import colors from "../values/Colors";
import {Avatar, ListItem} from "react-native-elements";
import Chevron from "../components/Chevron";
import Numeral from 'numeral';

export default class CompanyDetailScreen extends Component {
    static navigationOptions = {
        title: "Company Details"
    };

    constructor(props) {
        super(props);
        this.state = {
            company: this.props.navigation.getParam('company'),
            rounds: [],
            refreshing: false,
        }
    };

    async componentDidMount(): void {
        await this.getRounds();
    }

    getRounds = async () => {
        this.setState({refreshing: true});
        await (getRoundByCompany(this.state.company.companyId, global["jwt"])
            .then(response => response.json())
            .then(json => {
                this.setState({rounds: json.data});
            })
            .catch(error => console.log(error)));
        for await (const round of this.state.rounds) {
            await (getRoundInvestorByRound(round.roundId, global["jwt"])
                .then(response => response.json())
                .then(investorsJson => {
                    const rounds = this.state.rounds.map(r => {
                        if (r.roundId === round.roundId) {
                            return {
                                ...r,
                                roundInvestors: [...investorsJson.data]
                            }
                        } else {
                            return r
                        }
                    });
                    this.setState({rounds})
                }));
        }
        this.setState({refreshing: false});
    };

    _totalRoundAmount = (arr) => {
        if (arr !== undefined && arr.length > 0) {
            return arr.reduce((acc, entry) => acc + (entry.moneyRaised || 0), 0);
        }
    };

    _formatCurrency = (val) => Numeral(val).format('($ 0.[00] a)').toUpperCase();

    _formatVolume = (val) => Numeral(val).format('0.[00] a').toUpperCase();

    _navigateRound = () => {
        const {navigation} = this.props;
        if (this.state.rounds.length <= 0) {
            Alert.alert('Empty', 'No rounds', [{text: 'OK'}])
        } else {
            navigation.push('Round', {rounds: this.state.rounds});
        }
    };

    render() {
        return (
            <ScrollView>
                <Card>
                    <CardItem header bordered>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Avatar size={"medium"} source={{uri: this.state.company.photoUrl}}/>
                            <View style={{paddingLeft: "5%", justifyContent: 'space-between'}}>
                                <Text>
                                    {this.state.company.companyName}
                                </Text>
                                <Text>
                                    {this.state.company.address}
                                </Text>
                            </View>
                        </View>
                    </CardItem>
                    <CardItem bordered>
                        <Left>
                            <Text>Founders</Text>
                        </Left>
                        <Right>
                            <Text style={{textAlign: 'right'}}>{this.state.company.adminName}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Left>
                            <Text>Categories</Text>
                        </Left>
                        <Right>
                            <Text style={{textAlign: 'right'}}>{this.state.company.categories}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Left>
                            <Text>Capital</Text>
                        </Left>
                        <Right>
                            <Text>{this._formatCurrency(this.state.company.capital)}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Left>
                            <Text>Shares Volume</Text>
                        </Left>
                        <Right>
                            <Text>{this._formatVolume(this.state.company.totalShares)}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered button onPress={this._navigateRound}>
                        <Left>
                            <Text>Funding Rounds</Text>
                        </Left>
                        <Right style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{flex: 1, textAlign: 'right', paddingRight: "7%"}}>{this.state.rounds.length}</Text>
                            <Chevron style={{flex: 1}}/>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Left>
                            <Text>Total Funding Amount</Text>
                        </Left>
                        <Right>
                            <Text>{this._formatCurrency(this._totalRoundAmount(this.state.rounds))}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Body style={{justifyContent: 'space-between'}}>
                            <Text>Short Description</Text>
                            <Text>{this.state.company.companyDescription}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

});