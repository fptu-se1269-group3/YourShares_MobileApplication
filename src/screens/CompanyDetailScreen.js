import React, {Component} from 'react'
import {View, Text, Button, Platform, TouchableOpacity, TouchableNativeFeedback} from 'react-native'
import {Body, Card, CardItem, Item} from "native-base";
import InfoText from "../components/InfoText";
import {getUser} from "../services/UserService";
import {getRoundByCompany} from "../services/RoundServices";
import {getRoundInvestorByRound} from "../services/RoundInvestorService";


export default class CompanyDetailScreen extends Component {
    static navigationOptions = {
        title: "Company Details"
    };

    constructor(props) {
        super(props);
        this.state = {
            company: this.props.navigation.getParam('company'),
            rounds: [],
        };
    }

    componentDidMount(): void {
        Promise.all([getUser(this.state.company.adminProfileId, global["jwt"]).then(response => response.json()),
            getRoundByCompany(this.state.company.companyId, global["jwt"]).then(response => response.json())])
            .then(([userJson, roundsJson]) => {
                this.setState({company: Object.assign({}, this.state.company, {admin: `${userJson.data.firstName} ${userJson.data.lastName}`})});
                this.setState({rounds: roundsJson.data});
                for (let i = 0; i < this.state.rounds.length; i++) {
                    getRoundInvestorByRound(this.state.rounds[i].roundId, global["jwt"])
                        .then(response => response.json())
                        .then(investorsJson => {
                            const round = Object.assign({}, this.state.rounds[i], {roundInvestors: investorsJson.data});
                            const rounds = this.state.rounds;
                            rounds[i] = round;
                            this.setState({rounds})
                        });
                }
            })
            .catch(error => console.log(error))
    }

    renderCard(i) {
        return (
            <View>
                <Card style={{borderRadius: 10}} pointerEvents="none">
                    <CardItem header bordered style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                        <Text>{this.state.rounds[i].name}</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text>
                                Pre-round shares: {this.state.rounds[i].preRoundShares}
                            </Text>
                            <Text>
                                Post-round shares: {this.state.rounds[i].postRoundShares}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        )
    }

    renderCards() {
        const cards = [];
        const {navigation} = this.props;
        for (let i = 0; i < this.state.rounds.length; i++) {
            if (Platform.OS === 'ios') {
                cards.push(
                    <TouchableOpacity key={this.state.rounds[i].roundId}
                                      onPress={() => navigation.push('RoundDetails', {roundInvestors: this.state.rounds[i].roundInvestors})}>
                        {this.renderCard(i)}
                    </TouchableOpacity>
                )
            } else {
                cards.push(
                    <TouchableNativeFeedback key={this.state.rounds[i].roundId}
                                             onPress={() => navigation.push('RoundDetails', {roundInvestors: this.state.rounds[i].roundInvestors})}
                                             useForeground={true}>
                        {this.renderCard(i)}
                    </TouchableNativeFeedback>
                )
            }
        }
        return cards;
    }

    render() {
        const {navigation} = this.props;
        return (
            <View>
                <Text> {this.state.company.companyName} </Text>
                <InfoText text={"Information"}/>
                <Text> {this.state.company.companyDescription} </Text>
                <Text> {this.state.company.admin} </Text>
                <Text> {this.state.company.phone} </Text>
                <Text> {this.state.company.address} </Text>
                <Text> {this.state.company.capital} </Text>
                <Text> {this.state.company.totalShares} </Text>
                <InfoText text={"Rounds"}/>
                {this.renderCards()}
                <Button title={"BUTTON"} onPress={() => console.log(this.state.rounds)}/>
            </View>
        );
    }
}