import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { SearchBar, ListItem, Icon } from 'react-native-elements'
import * as SecureStore from 'expo-secure-store';
import { Container, Header, Content, Card, CardItem, Text, Body, Spinner } from "native-base";
import * as Icons from "@expo/vector-icons";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableNativeFeedback,
    FlatList,
    Animated,
    TextInput,
    StatusBar,
    Button,
    View,
} from 'react-native';
import colors from "../values/Colors";
import {searchCompany} from "../services/CompanyService";


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

    search(search) {
        this.setState({refreshing: true});
        searchCompany(search, global["jwt"])
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    companies: responseJson['data'],
                })

            })
            .catch((error) => {
                console.error(error)
            })
            .done(() => this.setState({refreshing: false}))

    }

    renderCard(item) {
        return (
            <View>
                <Card style={{ borderRadius: 10 }} pointerEvents="none">
                    <CardItem header bordered style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <Text>{item.companyName}</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text>
                                {item.companyDescription}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem footer bordered style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                        <Body>
                            <Text>
                                <Icons.FontAwesome name={'phone'} /> {item.phone}
                            </Text>
                            <Text>
                                <Icons.MaterialIcons name={'place'} /> {item.address}
                            </Text>
                        </Body>
                    </CardItem>
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
                                         useForeground={true}>
                    {this.renderCard(item)}
                </TouchableNativeFeedback>
            );
        }
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
});
