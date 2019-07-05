import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'
import {Item} from "native-base";
import {getCompany} from "../services/CompanyService";
import InfoText from "../components/InfoText";
import {getUser} from "../services/UserService";
import {getRoundByCompany} from "../services/RoundServices";


export default class CompanyDetailScreen extends Component {
    static navigationOptions = {
        title: "Company Details"
    };

    constructor(props) {
        super(props);
        this.state = {
            company: this.props.navigation.getParam('company'),
            rounds: []
        };
    }

    componentDidMount(): void {
        Promise.all([getUser(this.state.company.adminProfileId, global["jwt"]).then(response => response.json()),
            getRoundByCompany(this.state.company.companyId, global["jwt"]).then(response => response.json())])
            .then(([userJson, roundsJson]) => {
                this.setState({company: Object.assign({}, this.state.company, {admin: `${userJson.data.firstName} ${userJson.data.lastName}`})});
                this.setState({rounds: roundsJson.data})
            })
            .catch(error => console.log(error))
    }

    render() {
        const {navigation} = this.props;
        return (
            <View>
                <Text> {this.state.company.companyName} </Text>
                <InfoText text={"Information"}/>
                <Text> {this.state.company.companyDescription} </Text>
                <Text> {this.state.company.admin} </Text>
                <Text> {this.state.company.phone} </Text>
                <Text> {this.state.company.address} </Text>
                <Text> {this.state.company.capital} </Text>
                <Text> {this.state.company.totalShares} </Text>
                <InfoText text={"Rounds"}/>
            </View>
        );
    }
}