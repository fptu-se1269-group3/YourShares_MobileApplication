import React, {Component} from 'react'
import {
    View,
    Text,
    Button,
    Platform,
    TouchableOpacity,
    TouchableNativeFeedback,
    StyleSheet,
    FlatList
} from 'react-native'
import {Body, Card, CardItem, Icon, Item, Tab, TabHeading, Tabs, Accordion} from "native-base";
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
            refreshing: false
        };
    }

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

    renderCard(item) {
        return (
            <View>
                <Card style={{borderRadius: 10}} pointerEvents="none">
                    <CardItem header bordered style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                        <Text>{item.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text>{new Date(item.roundDate).toLocaleString()}</Text>
                            <Text>
                                Money raised: {item.moneyRaised}
                            </Text>
                            <Text>
                                Share increased: {item.shareIncreased}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        );
    }

    _totalRoundAmount = (arr) => {
        if (arr !== undefined && arr.length > 0) {
            return arr.reduce((acc, entry) => acc + (entry.moneyRaised || 0), 0);
        }
    };

    _formatCurrency = (val) => {
        return Numeral(val).format('($ 0.00 a)');
    };

    _formatVolume = (val) => {
        return Numeral(val).format('0.00 a');
    };

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <View>
                    <Card pointerEvents="none">
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
                            <Body>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{flex: 1, alignItems: 'flex-start'}}>
                                        Founder
                                    </Text>
                                    <Text style={{flex: 1, alignItems: 'flex-end', textAlign: 'right'}}>
                                        {this.state.company.adminName}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{flex: 1, alignItems: 'flex-start'}}>
                                        Categories
                                    </Text>
                                    <Text style={{flex: 1, alignItems: 'flex-end', textAlign: 'right'}}>
                                        {this.state.company.categories}
                                    </Text>
                                </View>
                            </Body>
                        </CardItem>
                        <CardItem footer bordered>
                            <Body>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{flex: 1, alignItems: 'flex-start'}}>
                                        Capital
                                    </Text>
                                    <Text style={{flex: 1, alignItems: 'flex-end', textAlign: 'right'}}>
                                        {this._formatCurrency(this.state.company.capital)}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{flex: 1, alignItems: 'flex-start'}}>
                                        Shares Volume
                                    </Text>
                                    <Text style={{flex: 1, alignItems: 'flex-end', textAlign: 'right'}}>
                                        {this._formatVolume(this.state.company.totalShares)}
                                    </Text>
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                </View>
                <View>
                    <ListItem title={"Funding Rounds"}
                              rightTitle={`${this.state.rounds.length}`}
                              containerStyle={styles.listItemContainer}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                              onPress={() => navigation.push('Round', {rounds: this.state.rounds})}
                              rightIcon={<Chevron/>}
                    />
                    <ListItem title={"Total Funding Amount"}
                              containerStyle={styles.listItemContainer}
                              rightTitle={`${this._formatCurrency(this._totalRoundAmount(this.state.rounds))}`}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                    />
                </View>
            </View>
        );
    }

    _renderItem = ({item}) => {
        const {navigation} = this.props;
        if (Platform.OS === 'ios') {
            return (
                <TouchableOpacity
                    onPress={() => navigation.push('RoundDetails', {roundInvestors: item.roundInvestors})}>
                    {this.renderCard(item)}
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableNativeFeedback
                    onPress={() => navigation.push('RoundDetails', {roundInvestors: item.roundInvestors})}
                    useForeground={true}>
                    {this.renderCard(item)}
                </TouchableNativeFeedback>
            );
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F5F4"
    },
    information: {
        marginLeft: "1%",
        marginRight: "1%",
    },
    infoText: {
        fontFamily: 'Roboto',
        fontSize: 15
    },
    row: {
        backgroundColor: "#ffffff",
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
    },
    listItemContainer: {
        height: 55,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    yourShares: {
        flex: 0.5,
    },
    company: {
        fontFamily: 'Roboto_medium',
        fontSize: 20,
        marginLeft: "1%",
        marginRight: "1%",
        textAlign: 'center',
        marginTop: "2%",
        color: colors.DODGER_BLUE,
    }
});