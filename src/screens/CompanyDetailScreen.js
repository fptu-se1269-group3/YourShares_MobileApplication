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
import {getUser} from "../services/UserService";
import {getRoundByCompany} from "../services/RoundServices";
import {getRoundInvestorByRound} from "../services/RoundInvestorService";
import colors from "../values/Colors";
import * as Icons from "@expo/vector-icons";
import {ListItem} from "react-native-elements";
import Chevron from "../components/Chevron";
import InfoText from "../components/InfoText";
import {ScrollView} from "react-navigation";


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
        this.setState({refreshing: true});
        await this.refresh();
        this.setState({refreshing: false});
        for (let i = 0; i < this.state.rounds.length; i++) {
            getRoundInvestorByRound(this.state.rounds[i].roundId, global["jwt"])
                .then(response => response.json())
                .then(investorsJson => {
                    const roundsCopy = Object.assign([], this.state.rounds);
                    roundsCopy[i].roundInvestors = [...investorsJson.data];
                    this.setState({rounds: roundsCopy})
                });
        }
    }

    refresh = async () => {
        await getRoundByCompany(this.state.company.companyId, global["jwt"])
            .then(response => response.json())
            .then(json => {
                this.setState({rounds: json.data});
            })
            .catch(error => console.log(error));
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
                                Pre-round shares: {item.preRoundShares}
                            </Text>
                            <Text>
                                Post-round shares: {item.postRoundShares}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={[styles.company]}>{this.state.company.companyName} </Text>
                <View style={{flex: 1}}>
                    <InfoText text={"Your Shareholding Status"}/>
                    <Card style={{borderRadius: 10}} pointerEvents="none">
                        <CardItem bordered style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'space-between'}}>
                            <Body>
                                <Text style={{color: 'green', fontWeight: 'bold', marginBottom: "1%"}}>
                                    Standard Account
                                </Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{alignItems: 'flex-start', flex: 1}}>Shareholding Volume</Text>
                                    <Text style={{alignItems: 'flex-end', flex: 1, textAlign: 'right'}}>2000 (5%)</Text>
                                </View>
                            </Body>
                        </CardItem>
                        <CardItem footer bordered style={{borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: 'space-between'}}>
                            <Body>
                                <Text style={{color: 'orange', fontWeight: 'bold', marginBottom: "1%"}}>
                                    Restricted Account
                                </Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{alignItems: 'flex-start', flex: 1}}>Shareholding Volume</Text>
                                    <Text style={{alignItems: 'flex-end', flex: 1, textAlign: 'right'}}>2000 (5%)</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{alignItems: 'flex-start', flex: 1}}>Convertible</Text>
                                    <Text style={{alignItems: 'flex-end', flex: 1, textAlign: 'right'}}>50% at Mar 25 2020</Text>
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                </View>
                <InfoText text={"Information"}/>
                <View style={styles.information}>
                    <ListItem title={"Founder"}
                              rightTitle={this.state.company.adminName}
                              containerStyle={styles.listItemContainer}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                    />
                    <ListItem title={"Funding Rounds"}
                              rightTitle={`${this.state.rounds.length}`}
                              containerStyle={styles.listItemContainer}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                              rightIcon={<Chevron/>}
                    />
                    <ListItem title={"Total Funding Amount"}
                              rightTitle={`5000000`}
                              containerStyle={styles.listItemContainer}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                    />
                    <ListItem title={"Capital"}
                              rightTitle={this.state.company.capital}
                              containerStyle={styles.listItemContainer}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                    />
                    <ListItem title={"Shares Volume"}
                              rightTitle={this.state.company.totalShares}
                              containerStyle={styles.listItemContainer}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                    />
                    <ListItem title={"Phone"}
                              rightTitle={this.state.company.phone}
                              containerStyle={styles.listItemContainer}
                              titleStyle={{fontSize: 16, color: colors.TEXT_COLOR}}
                    />
                    <Accordion dataArray={[
                        {title: 'Address', content: this.state.company.address},
                        {title: 'Description', content: this.state.company.companyDescription}
                    ]}
                               headerStyle={{backgroundColor: "#fff"}}
                    />
                </View>
            </ScrollView>
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

    TabRounds() {
        return (
            <FlatList keyExtractor={item => item.roundId}
                      data={this.state.rounds}
                      renderItem={this._renderItem}
                      refreshing={this.state.refreshing}
                      onRefresh={this.refresh}
            />
        )
    }

    TabShareholders() {
        return (
            <Text>This is Shareholders Tab</Text>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F5F4"
    },
    information: {
        flex: 3,
        marginLeft: "1%",
        marginRight: "1%",
        marginBottom: "1%",
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