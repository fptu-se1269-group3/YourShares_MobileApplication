import React, {Component} from "react";
import {ListItem, Text} from "react-native-elements";
import {SafeAreaView} from "react-navigation";
import {ScrollView, StyleSheet, View, Platform} from 'react-native';
import {Icon, Picker, Header, Tab, Tabs, TabHeading} from "native-base";
import DatePicker from 'react-native-datepicker';
import Tab1 from './SettingsScreen';
import Tab2 from './SettingsScreen';
import Tab3 from './SettingsScreen';
import colors from "../values/Colors";

export default class TransactionsScreen extends Component {
    static navigationOptions = {
        title: "Transactions"
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: "key1",
            date2: `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}"`
        };
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{position: 'relative', bottom: -10}}> From: </Text>
                            <View>
                                <DatePicker
                                    style={{alignSelf: 'flex-start'}}
                                    date={this.state.date} //initial date from state
                                    mode="date" //The enum of date, datetime and time
                                    placeholder="From date"
                                    format="DD-MM-YYYY"
                                    maxDate={this.state.date2}
                                    showIcon={true}
                                    iconComponent={
                                        <Icon name="arrow-down" style={{fontSize: 24, marginRight: 20}}/>
                                    }
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => {
                                        this.setState({date: date})
                                    }}
                                    customStyles={{
                                        dateInput: {
                                            borderColor: 'white'
                                        }
                                    }}
                                />
                            </View>
                            <Text style={{position: 'relative', bottom: -10}}> To: </Text>
                            <View>
                                <DatePicker
                                    style={{alignSelf: 'flex-end'}}
                                    date={this.state.date2} //initial date from state
                                    mode="date" //The enum of date, datetime and time
                                    placeholder="To date"
                                    format="DD-MM-YYYY"
                                    minDate={this.state.date}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={true}
                                    iconComponent={
                                        <Icon name="arrow-down" style={{fontSize: 24, marginRight: 20}}/>
                                    }
                                    onDateChange={(date2) => {
                                        this.setState({date2: date2})
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
                                    iosIcon={<Icon name="arrow-down" style={{color: '#FFADF2'}}/>}
                                    style={{width: Platform === 'ios' ? '130%' : 200, position: 'relative', bottom: -5}}
                                    placeholderStyle={{maxWidth: '100%'}}
                                    textStyle={{maxWidth: '130%'}}
                                    selectedValue={this.state.selected}
                                    onValueChange={(selected) => this.setState({selected})}>
                                    <Picker.Item label="Wallet" value="key0"/>
                                    <Picker.Item label="ATM Card" value="key1"/>
                                    <Picker.Item label="Debit Card" value="key2"/>
                                    <Picker.Item label="Credit Card" value="key3"/>
                                    <Picker.Item label="Net Banking" value="key4"/>
                                </Picker>
                            }
                            rightTitleStyle={{fontSize: 15, width: '100%', textAlign: 'right'}}
                            containerStyle={styles.listItemContainer}
                        />
                        <Tabs tabBarUnderlineStyle={{borderBottomWidth:2}}>
                            <Tab  heading={<TabHeading style={{backgroundColor: colors.LAYOUT_GREY}}>
                                <Icon name="arrow-round-up" style={{color: 'red'}}/>
                                <Icon name="arrow-round-down" style={{color: 'green'}}/>
                                <Text> All</Text>
                            </TabHeading>}>
                                <Tab1/>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor: colors.LAYOUT_GREY}}><Icon name="arrow-round-down" style={{color: 'green'}}/>
                                <Text> In</Text>
                            </TabHeading>}>
                                <Tab2/>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor: colors.LAYOUT_GREY}}><Icon name="arrow-round-up" style={{color: 'red'}}/>
                                <Text> Out</Text>
                            </TabHeading>}>
                                <Tab3/>
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