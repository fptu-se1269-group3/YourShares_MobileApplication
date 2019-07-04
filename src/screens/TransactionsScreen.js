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
            arrayCompanyName: [],
            arrayShareholder: [],
            isLoading: false,
            arrayTransaction: [],
        };
    }

    async componentDidMount() {
        await this.callAPI(global["userId"]);
        await this.getTransaction();
        this.setState({ isLoading: false });
        
    }

    async callAPI(id) {
        this.setState({ isLoading: true });
        const response = await fetch('http://api.yourshares.tk/api/shareholders/users/' + id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global['jwt']}`
            },
        })
        const responseJson = await response.json();
        for (let i = 0; i < responseJson.count; i++) {
            this.setState({
                arrayCompanyId: [...this.state.arrayCompanyId, responseJson['data'][i].companyId],
                arrayShareholder: [...this.state.arrayShareholder, responseJson['data'][i]]
            }
            )
            const response2 = await fetch('http://api.yourshares.tk/api/companies/' + responseJson['data'][i].companyId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${global['jwt']}`
                },

            })
            const responseJson2 = await response2.json();
            this.setState({
                arrayCompanyName: [...this.state.arrayCompanyName, responseJson2['data'].companyName]
            })
        }
    }

    async getTransaction() {
        if (this.state.selected === "all") {
            for (let i = 0; i < this.state.arrayShareholder.length; i++) {
                const response = await fetch('http://api.yourshares.tk/api/share-accounts/shareholders/' + this.state.arrayShareholder[i].shareholderId, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${global['jwt']}`
                    },
                })
                const responseJson = await response.json();
                if (responseJson['data'][i] != undefined) {
                    if (responseJson['data'][i].name == 'Standard') {
                        const response2 = await fetch('http://api.yourshares.tk/api/transactions/share-accounts/' + responseJson['data'][i].shareAccountId, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${global['jwt']}`
                            },

                        })
                        const responseJson2 = await response2.json();
                        this.setState({
                            arrayTransaction: [...this.state.arrayTransaction, ...responseJson2['data']]
                        })
                    }
                }
            };
        }
    }

    renderPicker() {
        const picker = [];
        for (let i = 0; i < this.state.arrayCompanyId.length; i++) {
            picker.push(
                <Picker.Item key={this.state.arrayCompanyId[i]} label={this.state.arrayCompanyName[i]} value={this.state.arrayCompanyId[i]} />
            )
        }
        return picker;
    }

    render() {
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
                                <Tab1 selected={this.state.selected} date={this.state.date} date2={this.state.date2} arrayTransaction={this.state.arrayTransaction} isLoading={this.state.isLoading} />
                            </Tab>
                            <Tab heading={<TabHeading style={{ backgroundColor: colors.LAYOUT_GREY }}><Icon name="arrow-round-down" style={{ color: 'green' }} />
                                <Text> In</Text>
                            </TabHeading>}>
                                <Tab2 arrayTransaction={this.state.arrayTransaction} isLoading={this.state.isLoading}/>
                            </Tab>
                            <Tab heading={<TabHeading style={{ backgroundColor: colors.LAYOUT_GREY }}><Icon name="arrow-round-up" style={{ color: 'red' }} />
                                <Text> Out</Text>
                            </TabHeading>}>
                                <Tab3 arrayTransaction={this.state.arrayTransaction} isLoading={this.state.isLoading}/>
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