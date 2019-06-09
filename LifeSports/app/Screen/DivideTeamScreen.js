import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements"
import { HeaderInfo } from '../Component/HeaderInfo'
import Util from '../Component/Util'

export default class JoinPlayerDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerList_A: [],
            playerList_B: [],
            spinner: true
        }
    }

    componentDidMount() {
        this.playerListRequest();
    }

    viewPlayerDetail = (player) => {
        this.props.navigation.navigate("JoinPlayerDetail", {"player": player});
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <HeaderInfo headerTitle="자동 팀 배치" navigation={this.props.navigation}></HeaderInfo>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, marginTop: -1}}>
                        <View style={{width: '102%', height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: global.backgroundColor3}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center', color: "#fff"}}>팀 A</Text>
                        </View>
                        
                        <ScrollView
                            contentContainerStyle={{borderRightWidth: 2, borderRightColor: global.backgroundColor3}}>
                            {
                                this.state.playerList_A.map((player, i) => (
                                    <ListItem
                                        key={i}
                                        leftAvatar={
                                            <Avatar
                                                rounded
                                                source={Util.MMRToURL(player.MMR)}
                                                avatarStyle={{ backgroundColor: 'white' }}
                                            />
                                        }
                                        title={player.name}
                                        subtitle={player.MMR}
                                        chevron
                                        titleStyle={styles.title}
                                        onPress={() => this.viewPlayerDetail(player)}
                                    />
                                ))
                            }
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1, marginTop: -1 }}>
                        <View style={{width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: global.backgroundColor3}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center', color: "#fff"}}>팀 B</Text>
                        </View>

                        <ScrollView>
                            {
                                this.state.playerList_B.map((player, i) => (
                                    <ListItem
                                        key={i}
                                        leftAvatar={
                                            <Avatar
                                                rounded
                                                source={Util.MMRToURL(player.MMR)}
                                                avatarStyle={{ backgroundColor: 'white' }}
                                            />
                                        }
                                        title={player.name}
                                        subtitle={player.MMR}
                                        chevron
                                        titleStyle={styles.title}
                                        onPress={() => this.viewPlayerDetail(player)}
                                    />
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
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
                'schedule_ID': this.props.navigation.getParam("id")
            })
        }
        return fetch('http://' + global.appServerIp + '/schedule/joinmember', data)
            .then((response) => response.json())
            .then((responseJson) => {
                let list_A = [];
                let list_B = [];
                for (let i = 0; i < responseJson.length; i++) {
                    if(responseJson[i].is_team_A == 1){
                        list_A.push({
                            UDID: responseJson[i].UDID,
                            ID: responseJson[i].ID,
                            name: responseJson[i].name,
                            gender: responseJson[i].gender,
                            MMR: responseJson[i].MMR
                        });
                    }
                    else{
                        list_B.push({
                            UDID: responseJson[i].UDID,
                            ID: responseJson[i].ID,
                            name: responseJson[i].name,
                            gender: responseJson[i].gender,
                            MMR: responseJson[i].MMR
                        });
                    }
                }

                this.setState({
                    playerList_A: list_A,
                    playerList_B: list_B,
                    spinner: false
                });
                console.log('Join MemberList Status : ', list_A, list_B);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}   

const styles = StyleSheet.create({
    title: {
        color: '#000'
    }
});