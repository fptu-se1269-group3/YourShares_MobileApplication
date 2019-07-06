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
import {Body, Card, CardItem, Icon, Item, Tab, TabHeading, Tabs} from "native-base";
import {getUser} from "../services/UserService";
import {getRoundByCompany} from "../services/RoundServices";
import {getRoundInvestorByRound} from "../services/RoundInvestorService";
import colors from "../values/Colors";
import * as Icons from "@expo/vector-icons";


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
        await Promise.all([getUser(this.state.company.adminProfileId, global["jwt"]).then(response => response.json()),
            getRoundByCompany(this.state.company.companyId, global["jwt"]).then(response => response.json())])
            .then(([userJson, roundsJson]) => {
                this.setState({company: Object.assign({}, this.state.company, {admin: `${userJson.data.firstName} ${userJson.data.lastName}`})});
                this.setState({rounds: roundsJson.data});
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
            <View style={styles.container}>
                <View style={styles.information}>
                    <Text style={[styles.company]}> {this.state.company.companyName} </Text>
                    <Text style={[styles.infoText, {textAlign: 'right', fontFamily:'Roboto_medium'}]} >Founder : {this.state.company.admin}</Text>
                    <Text style={styles.infoText}> {this.state.company.companyDescription} </Text>
                    <Text style={styles.infoText}>
                        <Icons.FontAwesome name={'phone'}/> Phone: {this.state.company.phone}
                    </Text>
                    <Text style={styles.infoText}>
                        <Icons.MaterialIcons name={'place'}/> Main address: {this.state.company.address}
                    </Text>
                    <Text style={styles.infoText}>
                        <Icons.MaterialIcons name={'attach-money'}/> {this.state.company.capital}
                    </Text>
                    <Text style={styles.infoText}>
                        <Icons.FontAwesome name={'money'}/> {this.state.company.totalShares}
                    </Text>
                </View>
                <View style={styles.tabs}>
                    <Tabs tabBarUnderlineStyle={{borderBottomWidth: 4, borderColor: colors.HEADER_LIGHT_BLUE}}>
                        <Tab heading={<TabHeading style={{backgroundColor: colors.LAYOUT_GREY}}>
                            <Text>Rounds</Text>
                        </TabHeading>}>
                            {this.TabRounds()}
                        </Tab>
                        <Tab heading={<TabHeading style={{backgroundColor: colors.LAYOUT_GREY}}>
                            <Text>Shareholders</Text>
                        </TabHeading>}>
                            {this.TabShareholders()}
                        </Tab>
                    </Tabs>
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
    },
    information: {
        flex: 1,
        marginLeft: "2%",
        marginRight: "2%",
        marginBottom: "1%",
        justifyContent: 'space-between'
    },
    infoText: {
        fontFamily: 'Roboto',
        fontSize: 15
    },
    tabs: {
        flex: 2,
    },
    company: {
        fontFamily: 'Roboto_medium',
        fontSize: 20,
        textAlign: 'center',
        marginTop: "2%",
        color: colors.DODGER_BLUE,
    }
});