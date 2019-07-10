import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {SearchBar, ListItem, Icon, Avatar} from 'react-native-elements'
import * as SecureStore from 'expo-secure-store';
import {Container, Header, Content, Card, CardItem, Text, Body, Spinner} from "native-base";
import moment from 'moment';
import Numeral from 'numeral';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableNativeFeedback,
    FlatList,
    StatusBar,
    View,
} from 'react-native';
import colors from "../values/Colors";
import {searchCompany} from "../services/CompanyService";
import {getShareholderByUser} from "../services/ShareholderService";
import {getUserShareAccountInCompany} from "../services/ShareAccountService";


export default class HomeScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            companies: [],
            refreshing: false
        };
    }

    async componentDidMount() {
        await (Promise.all([SecureStore.getItemAsync('jwt'),
            SecureStore.getItemAsync('userId')])
            .then(([jwt, userId]) => {
                global["jwt"] = jwt;
                global["userId"] = userId;
            }));
        this.search('')
    }

    async search(search) {
        this.setState({refreshing: true});
        await (Promise.all([searchCompany(search, global["jwt"]).then(response => response.json()),
                getShareholderByUser(global["userId"], global["jwt"]).then(response => response.json())])
                .then(([companyJson, shareholderJson]) => {
                    const companies = companyJson.data;
                    const shareholders = shareholderJson.data;
                    const mergeCompanies = companies.map(comp => {
                        const {userProfileId, shareholderId, shareholderType} = shareholders.find(s => s.companyId === comp.companyId);
                        return {
                            ...comp,
                            userProfileId,
                            shareholderId,
                            shareholderType
                        }
                    });
                    this.setState({companies: mergeCompanies});
                })
        );
        for await (const comp of this.state.companies) {
            await (getUserShareAccountInCompany(comp.companyId, global["userId"], global["jwt"])
                    .then(response => response.json())
                    .then(json => {
                        const companies = this.state.companies.map(c => {
                            if (c.companyId === comp.companyId) {
                                return {
                                    ...c,
                                    shareAccounts: json.data
                                }
                            } else {
                                return c
                            }
                        });
                        this.setState({companies})
                    })
            )
        }
        this.setState({refreshing: false});
    }

    _formatPercentage = (val) => {
        return Numeral(val/100).format('0.[000]%');
    };

    _formatDate = (val) => {
        return moment(val).format('MMM. DD YYYY');
    };

    renderCard(item) {
        const standard = item.shareAccounts !== undefined ? item.shareAccounts.find(acc => acc.name === 'Standard') : undefined;
        const restricted = item.shareAccounts !== undefined ? item.shareAccounts.find(acc => acc.name === 'Restricted') : undefined;
        return (
            <View>
                <Card style={{borderRadius: 10}} pointerEvents="none">
                    <CardItem header bordered style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Avatar size={"medium"} source={{uri: item.photoUrl}}/>
                            <View style={{paddingLeft: "5%", justifyContent: 'space-between'}}>
                                <Text>
                                    {item.companyName}
                                </Text>
                                <Text>
                                    {item.address}
                                </Text>
                            </View>
                        </View>
                    </CardItem>
                    {
                        standard !== undefined &&
                        <CardItem bordered style={{
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            justifyContent: 'space-between'
                        }}>
                            <Body>
                                <Text style={{color: 'green', fontWeight: 'bold', marginBottom: "1%"}}>
                                    Standard Account
                                </Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{alignItems: 'flex-start', flex: 1}}>Shareholding Volume</Text>
                                    <Text style={{
                                        alignItems: 'flex-end',
                                        flex: 1,
                                        textAlign: 'right'
                                    }}>{standard.shareAmount} ({this._formatPercentage(standard.shareAmountRatio)})</Text>
                                </View>
                            </Body>
                        </CardItem>
                    }
                    {
                        restricted !== undefined &&
                        <CardItem footer bordered style={{borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                            <Body>
                                <Text style={{color: 'orange', fontWeight: 'bold', marginBottom: "1%"}}>
                                    Restricted Account
                                </Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{alignItems: 'flex-start', flex: 1}}>Shareholding Volume</Text>
                                    <Text style={{alignItems: 'flex-end', flex: 1, textAlign: 'right'}}>
                                        {restricted.shareAmount}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{alignItems: 'flex-start', flex: 1}}>Convertible</Text>
                                    <Text style={{alignItems: 'flex-end', flex: 1, textAlign: 'right'}}>
                                        {this._formatPercentage(restricted.ratioConvert)} at {this._formatDate(restricted.timeConvert)}
                                    </Text>
                                </View>
                            </Body>
                        </CardItem>
                    }
                </Card>
            </View>
        );
    }

    _renderItem = ({item}) => {
        const {navigation} = this.props;
        if (Platform.OS === 'ios') {
            return (
                <TouchableOpacity key={item.companyId}
                                  onPress={() => navigation.push('CompanyDetails', {company: item})}>
                    {this.renderCard(item)}
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableNativeFeedback key={item.companyId}
                                         onPress={() => navigation.push('CompanyDetails', {company: item})}
                                         useForeground={true}
                                         delayPressIn={50}
                                         delayPressOut={50}
                >
                    {this.renderCard(item)}
                </TouchableNativeFeedback>
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' &&
                <View style={{height: 20, backgroundColor: "#007FFA"}}>
                    <StatusBar translucent backgroundColor={{backgroundColor: "#007FFA"}} barStyle={"light-content"}/>
                </View>
                }
                <SearchBar
                    platform={Platform.OS === 'ios' ? "ios" : "android"}
                    placeholder={"Search company ..."}
                    containerStyle={{backgroundColor: colors.HEADER_LIGHT_BLUE}}
                    onChangeText={(search) => {
                        this.setState({search});
                        this.search(search);
                    }}
                    value={this.state.search}
                />
                <FlatList keyExtractor={item => item.companyId}
                          data={this.state.companies}
                          renderItem={this._renderItem}
                          refreshing={this.state.refreshing}
                          onRefresh={() => this.search(this.state.search)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        flex: 1,
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {width: 0, height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
});
