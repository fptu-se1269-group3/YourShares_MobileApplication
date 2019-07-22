import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    TouchableHighlight
} from 'react-native'
import {Body, Card, CardItem, Left, Right, Text} from "native-base";
import {getRoundByCompany} from "../services/RoundServices";
import {getRoundInvestorByRound} from "../services/RoundInvestorService";
import colors from "../values/Colors";
import {Avatar, ListItem} from "react-native-elements";
import Chevron from "../components/Chevron";
import Numeral from 'numeral';
import {getChart} from "../services/ChartService";
import ImageView from "react-native-image-view";
import layout from '../values/Layout'

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
            chart: false,
            isVisible: false
        }
    };

    async componentDidMount(): void {
        await this.getRounds();
        if (this.state.rounds !== undefined && this.state.rounds.length > 0) {
            getChart(this._extractRoundsForChart(this.state.rounds))
                .then(response => {
                    if (response.status === 200) {
                        this.setState({chart: true});
                    }
                })
        }
    }

    _extractRoundsForChart = (rounds) => {
        const time = rounds.map(r => r.roundDate);
        const name = rounds.map(r => r.name);
        const value = rounds.map(r => r.moneyRaised);
        return {
            time,
            value,
            name,
        }
    };

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
        const images = [{
            source: {
                uri: 'https://bar-chart-api.herokuapp.com/plot.png'
            },
            title: 'Rounds funding analysis',
            width: 800,
            height: 500,
            resizeMode: 'contain',
            resizeMethod: 'resize'
        }];
        const imgWidth = layout.window.width;
        const imgHeight = imgWidth / 16 * 10;
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
                        <Body>
                            <Text style={styles.left}>Founders</Text>
                        </Body>
                        <Right>
                            <Text style={{textAlign: 'right'}}>{this.state.company.adminName}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text style={styles.left}>Categories</Text>
                        </Body>
                        <Right>
                            <Text style={{textAlign: 'right'}}>{this.state.company.categories}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text style={styles.left}>Capital</Text>
                        </Body>
                        <Right>
                            <Text style={styles.right}>{this._formatCurrency(this.state.company.capital)}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text style={styles.left}>Shares Volume</Text>
                        </Body>
                        <Right>
                            <Text style={styles.right}>{this._formatVolume(this.state.company.totalShares)}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered button onPress={this._navigateRound}>
                        <Body>
                            <Text style={styles.left}>Funding Rounds</Text>
                        </Body>
                        <Right style={{flexDirection: 'row'}}>
                            <Text style={[{
                                flex: 1,
                                textAlign: 'right',
                                paddingRight: "7%"
                            }, styles.right]}>{this.state.rounds.length}</Text>
                            <Chevron style={{flex: 1}}/>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text style={styles.left}>Total Funding Amount</Text>
                        </Body>
                        <Right>
                            <Text
                                style={styles.right}>{this._formatCurrency(this._totalRoundAmount(this.state.rounds))}</Text>
                        </Right>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text style={styles.left}>Short Description</Text>
                            <Text>{this.state.company.companyDescription}</Text>
                        </Body>
                    </CardItem>
                </Card>
                {this.state.chart &&
                <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
                    Rounds funding summary
                </Text>}
                {this.state.chart &&
                <TouchableHighlight onPress={() => this.setState({isVisible: true})}>
                    <View>
                        <Image
                            source={{uri: 'https://bar-chart-api.herokuapp.com/plot.png'}}
                            style={{width: imgWidth, height: imgHeight}}
                            resizeMode={'contain'}
                            resizeMethod={'resize'}
                        />
                        <ImageView
                            images={images}
                            imageIndex={0}
                            isVisible={this.state.isVisible}
                        />
                    </View>
                </TouchableHighlight>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    left: {
        fontWeight: 'bold',
        fontSize: 16
    },
    right: {
        fontWeight: 'bold',
        color: colors.TEXT_LINK
    },
    chart: {}
});