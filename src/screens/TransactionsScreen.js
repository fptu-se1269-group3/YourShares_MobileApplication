import React, { Component } from "react";
import { ListItem, Text } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { ScrollView, StyleSheet, View, Platform } from 'react-native';
import { Icon, Picker, Header, Tab, Tabs, TabHeading } from "native-base";
import DatePicker from 'react-native-datepicker';
import Tab1 from './TransactionsAllTab';
import Tab2 from './TransactionsInTab';
import Tab3 from './TransactionsOutTab';
import colors from "../values/Colors";

export default class TransactionsScreen extends Component {
    static navigationOptions = {
        title: "Transactions"
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: 'all',
            date2: `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`,
            date: undefined,
            arrayCompanyId: [],
            arrayCompanyName: []
        };
    }

    componentDidMount() {
        this.callAPI('4bae3f57-0dee-421b-dd1c-08d6fe1594e5')
            .then(() => console.log(this.state.arrayCompanyName[0]))
    }

    callAPI(id) {
        return fetch('http://api.yourshares.tk/api/shareholders/users/' + id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global['jwt']}`
            },

        }).then((response) => {
            return response.json()
        })
            .then((responseJson) => {
                for (let i = 0; i < responseJson.count; i++) {
                    this.setState({
                        arrayCompanyId: [...this.state.arrayCompanyId, responseJson['data'][i].companyId]

                    }
                    )
                    if (i == responseJson.count - 1) {
                        return fetch('http://api.yourshares.tk/api/companies/' + responseJson['data'][i].companyId, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${global['jwt']}`
                            },

                        }).then((response) => {
                            return response.json()
                        })
                            .then((responseJson) => {
                                this.setState({
                                    arrayCompanyName: [...this.state.arrayCompanyName, responseJson['data'].companyName]

                                })
                                console.log(this.state.arrayCompanyId[i]);
                            })
                            .catch((error) => {
                                alert(error);
                            });
                    } else {
                        fetch('http://api.yourshares.tk/api/companies/' + responseJson['data'][i].companyId, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${global['jwt']}`
                            },

                        }).then((response) => {
                            return response.json()
                        })
                            .then((responseJson) => {
                                this.setState({
                                    arrayCompanyName: [...this.state.arrayCompanyName, responseJson['data'].companyName]

                                })
                                console.log(this.state.arrayCompanyId[i]);
                            })
                            .catch((error) => {
                                alert(error);
                            });
                    }

                }
            })
            .catch((error) => {
                alert(error);
            });
    }
    renderPicker(){
        const picker = [];
        for (let i = 0; i < this.state.arrayCompanyId.length; i++) {
            console.log(i);
            picker.push(
                <Picker.Item key={this.state.arrayCompanyId[i]} label={this.state.arrayCompanyName[i]} value={this.state.arrayCompanyId[i]} />
            )
        }
        return picker;
    }

    render() {
        console.log('main')
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ position: 'relative', bottom: -10 }}> From: </Text>
                            <View>
                                <DatePicker
                                    style={{ alignSelf: 'flex-start' }}
                                    date={this.state.date} //initial date from state
                                    mode="date" //The enum of date, datetime and time
                                    placeholder="From date"
                                    format="DD-MM-YYYY"
                                    maxDate={this.state.date2}
                                    showIcon={true}
                                    iconComponent={
                                        <Icon name="arrow-down" style={{ fontSize: 24, marginRight: 20 }} />
                                    }
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => {
                                        this.setState({ date: date })
                                    }}
                                    customStyles={{
                                        dateInput: {
                                            borderColor: 'white'
                                        }
                                    }}
                                />
                            </View>
                            <Text style={{ position: 'relative', bottom: -10 }}> To: </Text>
                            <View>
                                <DatePicker
                                    style={{ alignSelf: 'flex-end' }}
                                    date={this.state.date2} //initial date from state
                                    mode="date" //The enum of date, datetime and time
                                    placeholder="To date"
                                    format="DD-MM-YYYY"
                                    minDate={this.state.date}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={true}
                                    iconComponent={
                                        <Icon name="arrow-down" style={{ fontSize: 24, marginRight: 20 }} />
                                    }
                                    onDateChange={(date2) => {
                                        this.setState({ date2: date2 });

                                    }}
                                    customStyles={{
                                        dateInput: {
                                            borderColor: 'white',
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <ListItem
                            title="Company"
                            rightTitle={
                                <Picker
                                    mode="dropdown"
                                    iosHeader="Your Header"
                                    iosIcon={<Icon name="arrow-down" style={{ color: '#FFADF2' }} />}
                                    style={{ width: Platform === 'ios' ? '130%' : 200, position: 'relative', bottom: -5 }}
                                    placeholderStyle={{ maxWidth: '100%' }}
                                    textStyle={{ maxWidth: '130%' }}
                                    selectedValue={this.state.selected}
                                    onValueChange={(selected) => this.setState({ selected })}>
                                    <Picker.Item label="all" value="all" />
                                    {this.renderPicker()}
                                </Picker>
                            }
                            rightTitleStyle={{ fontSize: 15, width: '100%', textAlign: 'right' }}
                            containerStyle={styles.listItemContainer}
                        />
                        <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 4, borderColor: colors.HEADER_LIGHT_BLUE }}>
                            <Tab heading={<TabHeading style={{ backgroundColor: colors.LAYOUT_GREY }}>
                                <Icon name="arrow-round-up" style={{ color: 'red' }} />
                                <Icon name="arrow-round-down" style={{ color: 'green' }} />
                                <Text> All</Text>
                            </TabHeading>}>
                                <Tab1 selected={this.state.selected} date={this.state.date} date2={this.state.date2} />
                            </Tab>
                            <Tab heading={<TabHeading style={{ backgroundColor: colors.LAYOUT_GREY }}><Icon name="arrow-round-down" style={{ color: 'green' }} />
                                <Text> In</Text>
                            </TabHeading>}>
                                <Tab2 />
                            </Tab>
                            <Tab heading={<TabHeading style={{ backgroundColor: colors.LAYOUT_GREY }}><Icon name="arrow-round-up" style={{ color: 'red' }} />
                                <Text> Out</Text>
                            </TabHeading>}>
                                <Tab3 />
                            </Tab>
                        </Tabs>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: (Platform.OS === 'ios') ? 0 : 22,
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        backgroundColor: 'white',
        flex: 1
    },
    userRow: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
    },
    userImage: {
        marginRight: 12,
    },
    listItemContainer: {
        height: 55,
        borderWidth: 0.5,
        borderColor: '#ECECEC',
    }
});