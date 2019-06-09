import React, {Component} from 'react';
import { View, ScrollView } from "react-native";

import {HeaderInfo} from '../Component/HeaderInfo'
import {MemberProfile} from '../Component/MemberProfile'

export default class TeamMemberDetailScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        const player = this.props.navigation.getParam("player");

        return(
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle={player.name} navigation={this.props.navigation}></HeaderInfo>
                <ScrollView>
                    <MemberProfile
                        player={player}
                    ></MemberProfile>
                </ScrollView>
            </View>
        );
    }
}   