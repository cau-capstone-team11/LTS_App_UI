import React, {Component} from 'react';
import { View, ActivityIndicator } from "react-native";

import {HeaderInfo} from '../Component/HeaderInfo'
import {MemberList} from '../Component/MemberList'

export default class JoinPlayerListScreen extends Component{
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
            <View style={{flex: 1}}>
                <HeaderInfo headerTitle={this.state.headerTitle} navigation={this.props.navigation}></HeaderInfo>
                {this.state.spinner ? 
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color={global.pointColor}/>
                    </View>
                :
                    <MemberList
                        playerList={this.state.playerList}
                        navigation={this.props.navigation}
                        DetailScreen="JoinPlayerDetail"
                    ></MemberList>
                }
            </View>
        );
    }

    playerListRequest = () => {
        
        ID = this.props.navigation.getParam("id")
        console.log("뭛 ㅂ다얏냐 : ", this.props.navigation)
        console.log("ID시발: ", ID)

        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'schedule_ID' : this.props.navigation.getParam("id")
            })
        }
        return fetch('http://' + global.appServerIp + '/schedule/joinmember', data)
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
                console.log('Join MemberList Status : ', list);
            })
            .catch((error) => {
				console.error(error);
            });
	}
}