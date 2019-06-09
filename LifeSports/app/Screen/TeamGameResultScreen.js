import React, {Component} from 'react';
import { Image, View, Text, StyleSheet, ScrollView } from "react-native";
import { Icon, Card, Divider } from "react-native-elements"

import {HeaderInfo} from '../Component/HeaderInfo'
import Util from '../Component/Util'

export default class TeamGameResultScreen extends Component{
    static navigationOptions = {
        tabBarLabel: "경기 전적",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="flag" size={25} type="font-awesome" color={tintColor} />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            gameResult: []
        }
    }
    
    componentDidMount(){
        this.gameResultRequest();
    }

    render(){
        const MyTeamInfo = this.props.navigation.getParam("MyTeamInfo");

        return(
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle="경기 전적" navigation={this.props.navigation}></HeaderInfo>
                
                <View style={[styles.statisticsContainer, {backgroundColor: global.backgroundColor3}]}>
                    <Text style={[styles.score, {color: global.pointColor}]}>181 승 93 패</Text>
                </View>

                <Divider style={{height: 2, backgroundColor: "#e1e8ee"}}/>
                
                <View style={{flex: 3.5}}>
                    <ScrollView>
                        {
                            this.state.gameResult.map((item, i) => {
                                return(
                                    <Card key={i}>
                                        <View style={{flex: 1}}>
                                            <View style={styles.titleContainer}>
                                                <View style={{flex: 1}}>
                                                    <Image
                                                        style={item.win ? [styles.image, {display: 'flex'}] : [styles.image, {display: 'none'}]}
                                                        source={require('../Images/win.png')}
                                                    />
                                                    <Text style={item.win ? styles.winnerTeamName : styles.loserTeamName}>{MyTeamInfo.name}</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Text style={[styles.score, {color: global.pointColor}]}>{item.myTeamScore} : {item.opponentTeamScore}</Text>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <Image
                                                        style={item.win ? [styles.image, {display: 'none'}] : [styles.image, {display: 'flex'}]}
                                                        source={require('../Images/win.png')}
                                                    />
                                                    <Text style={item.win ? styles.loserTeamName : styles.winnerTeamName}>{item.opponentTeam}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Divider style={{height: 2, backgroundColor: "#e1e8ee"}}/>
                                        <View style={{flex: 4, marginTop: 15}}>
                                            <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                                                <View style={{flex: 1}}><Text style={styles.contentTitle}>경기일자</Text></View>
                                                <View style={{flex: 1}}><Text style={styles.contentTitle}>장소</Text></View>
                                                <View style={{flex: 1}}><Text style={styles.contentTitle}>MVP</Text></View>
                                            </View>
                                            <View style={{flex: 4, flexDirection: 'row', marginTop: 5}}>
                                                <View style={{flex: 1}}><Text style={styles.content}>{item.date}</Text></View>
                                                <View style={{flex: 1}}><Text style={styles.content}>{item.gym}</Text></View>
                                                <View style={{flex: 1}}><Text style={styles.content}>{item.MVP}</Text></View>
                                            </View>
                                        </View>
                                        <View style={{flex: 1}}>
                                        </View>
                                    </Card>
                                );
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }

    gameResultRequest() {
        const MyTeamInfo = this.props.navigation.getParam("MyTeamInfo");

        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'team_ID' : MyTeamInfo.ID
            })
        }
        let gameResult = [];
        return fetch('http://' + global.appServerIp + '/team/teamresult', data)
            .then((response) => response.json())
            .then((responseJson) => {
                for(var i = 0; i < responseJson.length; i++){
                    if(responseJson[i].is_win == 1) win = true;
                    else win = false;

                    gameResult.push({
                        opponentTeam: responseJson[i].oppositeTeam,
                        myTeamScore: responseJson[i].myTeamScore,
                        opponentTeamScore: responseJson[i].oppositeTeamScore,
                        win: win,
                        date: Util.ISOToDate(responseJson[i].starttime),
                        gym: responseJson[i].gym,
                        MVP: responseJson[i].MVP
                    })
                }

                this.setState({
                    gameResult: gameResult
                })

                console.log('Game Result: ', responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

const styles = StyleSheet.create({
    statisticsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: -1
    },
    titleContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems:'center',
        marginBottom: 10
    },
    winnerTeamName:{
        color: "black",
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: -14
    },
    loserTeamName:{
        color: "black",
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    score:{
        fontSize: 33,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: -3
    },
    contentTitle: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginBottom: 10
    },
    content: {
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    image: {
        position: 'relative',
        top: -15,
        left: 0,
        width: '30%',
        height: '30%',
    }
});