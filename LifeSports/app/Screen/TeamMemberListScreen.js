import React, {Component} from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from "react-native";
import { Icon } from "react-native-elements"

import {HeaderInfo} from '../Component/HeaderInfo'
import {MemberList} from '../Component/MemberList'

export default class TeamMemberListScreen extends Component{
    static navigationOptions = {
        tabBarLabel: "팀원 정보",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="users" size={25} type="font-awesome" color={tintColor} />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            playerList: [],
            spinner: true
        }
    }

    componentDidMount(){
        this.setState({
            headerTitle: this.props.navigation.getParam("headerTitle"),
            playerList: []
        });
        this.playerListRequest();
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle={this.state.headerTitle} navigation={this.props.navigation}></HeaderInfo>
                {this.state.spinner ? 
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color={global.pointColor}/>
                    </View>
                :
                    <MemberList
                        playerList={this.state.playerList}
                        navigation={this.props.navigation}
                        DetailScreen="TeamMemberDetail"
                    ></MemberList>
                }
            </View>
        );
    }

    playerListRequest = () => {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'team_ID' : this.props.navigation.getParam("MyTeamInfo").ID
            })
        }
        return fetch('http://' + global.appServerIp + '/team/teammember', data)
            .then((response) => response.json())
            .then((responseJson) => {
                let list = [];
                for(let i = 0; i < responseJson.length; i++){
                    list.push({
                        UDID: responseJson[i].UDID,
                        ID: responseJson[i].ID,
                        name: responseJson[i].name,
                        gender: responseJson[i].gender,
                        MMR: responseJson[i].MMR
                    });
                }

                this.setState({
                    playerList : list,
                    spinner: false
                });
                console.log('Team MemberList Status : ', list);
            })
            .catch((error) => {
				console.error(error);
            });
	}
}