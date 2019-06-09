import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Icon } from "react-native-elements"

import {HeaderInfo} from '../Component/HeaderInfo'
import {TeamProfile} from '../Component/TeamProfile';

export default class TeamInfoScreen extends Component{
    static navigationOptions = {
        tabBarLabel: "팀 정보",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="users" size={25} type="font-awesome" color={tintColor} />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderInfo headerTitle="팀 정보" navigation={this.props.navigation} pop={true}></HeaderInfo>
                <ScrollView>
                    <TeamProfile
                        teamInfo={this.props.navigation.getParam("MyTeamInfo")}
                    />
                </ScrollView>
            </View>
        );
    }
}   
