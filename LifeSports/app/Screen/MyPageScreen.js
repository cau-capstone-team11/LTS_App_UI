import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-elements'
import { SecureStore } from 'expo';

import {HeaderInfo} from '../Component/HeaderInfo'
import {MemberProfile} from '../Component/MemberProfile';

export default class MyPageScreen extends Component {
    constructor(props) {
        super(props);
        state = {
        }
    }

    logout = async () => {
        
        SecureStore.deleteItemAsync("id")
        SecureStore.deleteItemAsync("password")
        console.log("Credentials removed Successfully")
        global.loginStatus = false;
        global.hasTeam = false;
        global.UDID = '';
        global.ID = '';
        global.name = '';
        global.gender = '';
        global.MMR = '';
        global.refresh = true;
        this.props.navigation.popToTop();
        
        // 메인 화면 정보 초기화
    }

    render(){
        const player = this.props.navigation.getParam("player");

        return(
            <View style={{flex: 1}}>
                <HeaderInfo headerTitle="마이 페이지" navigation={this.props.navigation}></HeaderInfo>
                <ScrollView>
                    <MemberProfile
                        player={player}
                    ></MemberProfile>
                    <View style={{backgroundColor: global.backgroundColor, paddingTop: 15}}>
                    <Button
                        title="로그아웃"
                        buttonStyle={{backgroundColor: global.pointColor}}
                        titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                        onPress={this.logout}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}