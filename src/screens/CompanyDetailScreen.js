import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {getCompany} from "../services/CompanyService";

export default class CompanyDetailScreen extends Component{
    static navigationOptions = {
        title: "Company Details"
    };

    constructor(props) {
        super(props);
        this.state = {
            companyId:''
        };

        this.state.companyId = this.props.navigation.getParam('companyId');
        getCompany(this.state.companyId, global["jwt"])
            .then(result => console.log(result))
    }
    render() {
        return (
            <View>
                <Text>This is Company detail</Text>
            </View>
        );
    }
}