import React, {Component} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CheckBox, Button, Overlay, ListItem, Avatar } from 'react-native-elements'

import {HeaderInfo} from '../Component/HeaderInfo'
import {SelectStatus} from '../Component/SelectStatus'
import Util from '../Component/Util'

export default class ReservationCheckScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            MyTeamInfo: [],
            isVisible: false,
            selectTeam: '선택해 주세요',
            selectTeamID: ''
        }
        this.onPressComplete = this.onPressComplete.bind(this)
    }

    componentDidMount(){
        const statusList = this.props.navigation.getParam("statusList");
        if(statusList[0] == "예약"){
            this.teamInfoRequest();
        }
    }

    onPressCheckBox = () => {
        this.setState({checked:!this.state.checked});
    }

    onPressComplete(type){
        this.reservRequest(type)
    }

    viewPlayerList = (item) => {
        // PlayerList 받아오기
        this.props.navigation.navigate("JoinPlayerList", {"id": item.scheduleID, "item": item, "headerTitle": "참여자 목록"});
    }

    onPressTeamList = () => {
        this.setState({isVisible: true});
    }

    onSelectTeam = (ID, name) => {
        this.setState({isVisible: false, selectTeam: name, selectTeamID: ID})
    }

    onPressProfile = (team) => {
        this.teamProfileRequest();
    }

    render() {
        const statusList = this.props.navigation.getParam("statusList");
        const selectItem = this.props.navigation.getParam("item");
        const type = this.props.navigation.getParam("type")
        
        let reserveType;
        console.log("gksdkfsfk", type)
        if(statusList[0] == "예약" && type == 1){
            reserveType = <NewReservation item={selectItem}
                                        selectTeam={this.state.selectTeam}
                                        teamList={this.state.MyTeamInfo}
                                        checked={this.state.checked}
                                        onPressCheckBox={()=>this.onPressCheckBox()}
                                        onPressComplete={this.onPressComplete}
                                        onPressTeamList={()=>this.onPressTeamList()}
                                        onSelectTeam={this.onSelectTeam}
                                        isVisible={this.state.isVisible}/>
        }
        else if(statusList[0] == "예약" && type == 3){
            reserveType = <JoinReservation item={selectItem}
                                        selectTeam={this.state.selectTeam}
                                        teamList={this.state.MyTeamInfo}
                                        checked={this.state.checked}
                                        onPressCheckBox={()=>this.onPressCheckBox()}
                                        onPressComplete={this.onPressComplete}
                                        onPressTeamList={()=>this.onPressTeamList()}
                                        onSelectTeam={this.onSelectTeam}
                                        onPressProfile={this.onPressProfile}
                                        isVisible={this.state.isVisible}/>
        }
        else if(statusList[0] == "매칭"){
            console.log(selectItem)
            reserveType = <Matching item={selectItem}
                                    onPressNextBtn={()=>this.viewPlayerList(selectItem)}
                                    onPressComplete={this.onPressComplete}/>
        }

        return(
            <View style={{flex: 1}}>
                <HeaderInfo headerTitle={selectItem.name} navigation={this.props.navigation}></HeaderInfo>
                <SelectStatus statusList={statusList}></SelectStatus>
                {reserveType}
            </View>
        );
    }

    teamInfoRequest = () => {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'UDID' : global.UDID
            })
        }
        let MyTeamInfo = []
        return fetch('http://' + global.appServerIp + '/user/hasteam', data)
            .then((response) => response.json())
            .then((responseJson) => {
                for(var i = 0; i < responseJson.length; i++){
                    if(responseJson[i].isleader == 1){
                        MyTeamInfo.push({
                            ID: responseJson[i].team_ID,
                            name: responseJson[i].team_name,
                            MMR: responseJson[i].team_MMR
                        });
                    }
                }

                this.setState({
                    MyTeamInfo: MyTeamInfo
                })

                console.log('MyTeamInfo: ', responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    teamProfileRequest = () => {
        const selectItem = this.props.navigation.getParam("item");
        
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'schedule_ID' : selectItem.scheduleID
            })
        }
        let MyTeamInfo = []
        return fetch('http://' + global.appServerIp + '/schedule/detail', data)
            .then((response) => response.json())
            .then((responseJson) => {
                for(var i = 0; i < responseJson.length; i++){
                    MyTeamInfo.push({
                        ID: responseJson[i].reserv_team_ID,
                        name: responseJson[i].reserv_team_name,
                        MMR: responseJson[i].reserv_team_MMR,
                        winRate: responseJson[i].reserv_winning_rate
                    });
                }

                this.setState({
                    MyTeamInfo: MyTeamInfo
                })

                console.log('Schedule Reserv Team Info: ', responseJson)
                this.props.navigation.navigate("TeamInfo", {'MyTeamInfo': MyTeamInfo[0], "headerTitle": responseJson[0].reserv_team_name});
            })
            .catch((error) => {
                console.error(error);
            });
    }

    reservRequest(type){
        console.log("ㅎ헣허", type)
        const selectItem = this.props.navigation.getParam("item");
        // empty Reserv
        if(type == 1){
            if(this.state.selectTeamID == ''){
                Alert.alert('ERROR', '팀을 선택해주세요');
                return;
            }

            let data = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    'schedule_ID': selectItem.scheduleID,
                    'team_ID': this.state.selectTeamID,
                    'is_solo': this.state.checked
                })
            }

            return fetch('http://' + global.appServerIp + '/schedule/schedulereservupdate', data)
                .then((response) => {
                    console.log("Reserv Game : ", response)
                    global.refresh = true;
                    this.props.navigation.popToTop();
                })
        }
        
        // join Reserv
        else if(type == 2){ 
            if(this.state.selectTeamID == ''){
                Alert.alert('ERROR', '팀을 선택해주세요');
                return;
            }

            let data = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    'schedule_ID': selectItem.scheduleID,
                    'team_ID': this.state.selectTeamID
                })
            }

            return fetch('http://' + global.appServerIp + '/schedule/schedulereservjoin', data)
                .then((response) => {
                    console.log("Join Reserv : ", response)
                    global.refresh = true;
                    this.props.navigation.popToTop();
                })
        }

        // join Matching
        else if(type == 3){
            let data = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    'schedule_ID': selectItem.scheduleID,
                    'UDID': global.UDID
                })
            }

            return fetch('http://' + global.appServerIp + '/schedule/schedulematchupdate', data)
                .then((response) => {
                    console.log("Join Matching : ", response)
                    global.refresh = true;
                    this.props.navigation.popToTop();
                })
        }
    }
}

function NewReservation(props){
    return(
        <View style={styles.dialog}>
            <Overlay
                isVisible={props.isVisible}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayBackgroundColor={global.backgroundColor3}
                width="80%"
                height="80%"
            >
                <View style={{ flex: 1 }}>
                    {
                        props.teamList.map((team, i) => (
                            <ListItem
                                key={i}
                                leftAvatar={
                                    <Avatar
                                        rounded
                                        source={Util.MMRToURL(team.MMR)}
                                        avatarStyle={{ backgroundColor: 'white' }}
                                    />
                                }
                                title={team.name}
                                subtitle={team.MMR}
                                chevron
                                titleStyle={styles.listItem}
                                onPress={() => props.onSelectTeam(team.ID, team.name)}
                            />
                        ))
                    }
                </View>
            </Overlay>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}><Text style={styles.Title}>예약자명</Text></View>
                    <View style={{ flex: 3 }}><Text style={styles.Detail}>{global.name}</Text></View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}><Text style={styles.Title}>팀명</Text></View>
                    <View style={{ flex: 1.5 }}><Text style={styles.Detail}>{props.selectTeam}</Text></View>
                    <View style={{ flex: 1.5, justifyContent: 'center' }}>
                        <Button title="팀 선택"
                            buttonStyle={{ backgroundColor: global.pointColor, width: '100%' }}
                            titleStyle={{ color: "#000", fontWeight: 'bold' }}
                            onPress={props.onPressTeamList}></Button>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}><Text style={styles.Title}>예약시간</Text></View>
                    <View style={{ flex: 3 }}><Text style={styles.Detail}>{props.item.startTime}~{props.item.endTime}</Text></View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>끼어들기</Text></View> 
                    <View style={{flex: 3, justifyContent: 'center'}}>
                        <CheckBox
                            iconRight
                            checked={props.checked}
                            onPress={props.onPressCheckBox}
                            checkedColor={global.pointColor}/>
                    </View> 
                </View>
            </View>
            <Text style={styles.Title}>경기 취소시 이러이러이러리</Text>
            <Button title="참여하기"
                buttonStyle={{ backgroundColor: global.pointColor }}
                titleStyle={{ color: "#000", fontWeight: 'bold' }}
                onPress={() => props.onPressComplete(1)}></Button>
        </View>
    );
}

function JoinReservation(props){
    return(
        <View style={styles.dialog}>
            <Overlay
                isVisible={props.isVisible}
                windowBackgroundColor="rgba(255, 255, 255, .5)"
                overlayBackgroundColor={global.backgroundColor3}
                width="80%"
                height="80%"
            >
                <View style={{flex: 1}}>
                {
                    props.teamList.map((team, i) => (
                        <ListItem
                            key={i}
                            leftAvatar={
                                <Avatar
                                    rounded
                                    source={Util.MMRToURL(team.MMR)}
                                    avatarStyle={{backgroundColor: 'white'}}
                                />
                            }
                            title={team.name}
                            subtitle={team.MMR}
                            chevron
                            titleStyle={styles.listItem}
                            onPress={()=>props.onSelectTeam(team.ID, team.name)}
                        />
                    ))
                }
                </View>
            </Overlay>
            <View style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>예약팀명</Text></View> 
                    <View style={{flex: 1.5}}><Text style={styles.Detail}>{props.item.MyTeamName}</Text></View> 
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                        <Button title="팀 프로필"
                            buttonStyle={{backgroundColor: global.pointColor, width: '100%'}}
                            titleStyle={{color: "#000", fontWeight: 'bold'}}
                            onPress={()=>props.onPressProfile(props.item)}></Button>    
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>팀명</Text></View> 
                    <View style={{flex: 1.5}}><Text style={styles.Detail}>{props.selectTeam}</Text></View> 
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                        <Button title="팀 선택"
                            buttonStyle={{backgroundColor: global.pointColor, width: '100%'}}
                            titleStyle={{color: "#000", fontWeight: 'bold'}}
                            onPress={props.onPressTeamList}></Button>    
                    </View> 
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>예약시간</Text></View> 
                    <View style={{flex: 3}}><Text style={styles.Detail}>{props.item.startTime}~{props.item.endTime}</Text></View> 
                </View>
            </View>
            <Text style={styles.Title}>경기 취소시 이러이러이러리</Text>
            <Button title="참여하기"
                    buttonStyle={{backgroundColor: global.pointColor}}
                    titleStyle={{color: "#000", fontWeight: 'bold'}}
                    onPress={()=>props.onPressComplete(2)}></Button>
        </View>
    );
}

function Matching(props){
    return(
        <View style={styles.dialog}>
            <View style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>참여자명</Text></View> 
                    <View style={{flex: 3}}><Text style={styles.Detail}></Text></View> 
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>참여현황</Text></View> 
                    <View style={{flex: 3}}><Text style={styles.Detail}>{props.item.currentParticipant}/{props.item.maxParticipant}</Text></View> 
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>참가자 목록</Text></View> 
                    <View style={{flex: 3, justifyContent: 'center'}}>
                        <Button title="확인하기"
                            buttonStyle={{backgroundColor: global.pointColor, width: '100%'}}
                            titleStyle={{color: "#000", fontWeight: 'bold'}}
                            onPress={props.onPressNextBtn}></Button>    
                    </View> 
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}><Text style={styles.Title}>경기시간</Text></View> 
                    <View style={{flex: 3}}><Text style={styles.Detail}>{props.item.startTime}~{props.item.endTime}</Text></View> 
                </View>
            </View>
            <Text style={styles.Title}>경기 취소시 이러이러이러리</Text>
            <Button title="참여하기"
                    buttonStyle={{backgroundColor: global.pointColor}}
                    titleStyle={{color: "#000", fontWeight: 'bold'}}
                    onPress={()=>props.onPressComplete(3)}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        // marginRight: 10,
        marginTop: 17
    },
    Title: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: "#000"
    },
    Detail: {
        paddingLeft: 15,
        flex: 1,
        fontSize: 16,
        textAlignVertical: 'center',
        color: "#000"
    },
    reserveBtn: {
        width: '100%',
        height: 30
    },
    listItem: {
        color: '#000'
    },
});