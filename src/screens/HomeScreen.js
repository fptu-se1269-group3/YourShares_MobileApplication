import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { SearchBar, ListItem, Icon } from 'react-native-elements'
import * as SecureStore from 'expo-secure-store';
import { Container, Header, Content, Card, CardItem, Text, Body } from "native-base";
import * as Icons from "@expo/vector-icons";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableNativeFeedback,
    Animated,
    TextInput,
    StatusBar,
    Button,
    View,
} from 'react-native';
import colors from "../values/Colors";
import {searchCompany} from "../services/CompanyService";
import {getUser} from "../services/UserService";


export default class HomeScreen extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }

    async componentWillMount(): void {
        await (Promise.all([SecureStore.getItemAsync('jwt'),
            SecureStore.getItemAsync('userId')])
            .then(([jwt, userId]) => {
                global["jwt"] = jwt;
                global["userId"] = userId;
            }));
        this.search('')
    }

    search(search) {
        searchCompany(search, global["jwt"])
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    count: responseJson.count,
                    companies: responseJson['data'],
                })

            })
            .catch((error) => {
                console.error(error)
            });

    }

    renderCard(i) {
        return(
            <View>
                <Card style={{ borderRadius: 10 }} pointerEvents="none">
                    <CardItem header bordered style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <Text>{this.state.companies[i].companyName}</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text>
                                {this.state.companies[i].companyDescription}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem footer bordered style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                        <Body>
                            <Text>
                                <Icons.FontAwesome name={'phone'} /> {this.state.companies[i].phone}
                            </Text>
                            <Text>
                                <Icons.MaterialIcons name={'place'} /> {this.state.companies[i].address}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        );
    };

    renderCards() {
        const {navigation} = this.props;
        const card = [];
        for (let i = 0; i < this.state.count; i++) {
            if (Platform.OS === 'ios') {
                card.push(
                    <TouchableOpacity key={this.state.companies[i].companyId}
                                      onPress={() => navigation.push('Company', {company: this.state.companies[i]})}>
                        {this.renderCard(i)}
                    </TouchableOpacity>
                )
            } else {
                card.push(
                    <TouchableNativeFeedback key={this.state.companies[i].companyId}
                                             onPress={() => navigation.push('Company', {company: this.state.companies[i]})}
                                             useForeground={true}>
                        {this.renderCard(i)}
                    </TouchableNativeFeedback>
                )
            }
        }
        return card;

    };
    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' ? <View style={{height: 20, backgroundColor: "#007FFA" }}>
                    <StatusBar translucent backgroundColor={{backgroundColor: "#007FFA"}} barStyle={"light-content"}/>
                </View> : <StatusBar/>}
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
                <ScrollView
                    style={styles.contentContainer}>
                    {this.renderCards()}
                </ScrollView>
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
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: -3 },
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
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
