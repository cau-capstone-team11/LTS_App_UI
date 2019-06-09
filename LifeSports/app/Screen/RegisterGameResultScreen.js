import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { Input, Button, Overlay, Avatar, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { HeaderInfo } from '../Component/HeaderInfo'
import Util from '../Component/Util'

export default class RegisterGameResultScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleInfo: '',
            reservScore: 0,
            opponentScore: 0,
            playerList: [],
            isVisible: false,
            selectMemberUDID: '',
            selectMemberName: ''
        }
    }

    componentDidMount() {
        this.scheduleinfoRequest();
    }

    updateText = (key, text) => {
        this.setState({[key]: text})
    }

    onPressMemberList = () => {
        this.setState({isVisible: true});
    }

    onSelectMember = (ID, name) => {
        this.setState({isVisible: false, selectMemberName: name, selectMemberUDID: UDID})
    }

    render() {
        if (this.state.scheduleInfo.MyTeamName == undefined)
            myTeamName = "A팀"
        else myTeamName = this.state.scheduleInfo.MyTeamName

        if (this.state.scheduleInfo.opponentTeamName == undefined)
            opponentTeamName = "B팀"
        else opponentTeamName = this.state.scheduleInfo.opponentTeamName

        const labelMyTeam = myTeamName + " 스코어"
        const labelOpponentTeam = opponentTeamName + " 스코어"
        return (
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <Overlay
                    isVisible={this.state.isVisible}
                    windowBackgroundColor="rgba(255, 255, 255, .5)"
                    overlayBackgroundColor={global.backgroundColor3}
                    width="80%"
                    height="80%"
                >
                    <View style={{ flex: 1 }}>
                        <ScrollView>
                        {
                            this.state.playerList.map((player, i) => (
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
                                    titleStyle={styles.listItem}
                                    onPress={() => this.onSelectMember(player.UDID, player.name)}
                                />
                            ))
                        }
                        </ScrollView>
                    </View>
                </Overlay>
                <HeaderInfo headerTitle="경기 평가" navigation={this.props.navigation}></HeaderInfo>
                <View style={{width: '100%', height: 50, justifyContent: 'center', backgroundColor: global.backgroundColor3, flexDirection: 'row', marginTop: -1}}>
                    <View style={{flex: 1}}>
                        <Text style={{marginTop: 13, fontSize: 20, color: "#fff", fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center'}}>{myTeamName}</Text>
                    </View>
                    <View style={{flex: 0.3}}>
                        <Text style={{marginTop: 13, fontSize: 20, color: "#fff", fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center'}}>VS</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{marginTop: 13, fontSize: 20, color: "#fff", fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center'}}>{opponentTeamName}</Text>
                    </View>
                </View>
                <ScrollView 
                    keyboardDismissMode='on-drag'
                    contentContainerStyle={styles.container}>
                        
                    <InputComponent
                        iconName="user"
                        label={labelMyTeam}
                        placeholder=""
                        stateKey="reservScore"
                        updateText={this.updateText}
                    ></InputComponent>

                    <InputComponent
                        iconName="user"
                        label={labelOpponentTeam}
                        placeholder=""
                        stateKey="opponentScore"
                        updateText={this.updateText}
                    ></InputComponent>

                    <View style={{width: '75%', marginTop: 20}}>
                        <Button
                            buttonStyle={{backgroundColor: global.pointColor, width: '100%'}}
                            titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                            title={"MVP 선택"}
                            onPress={this.onPressMemberList}/>
                    </View>
                    <View style={{width: '75%', marginTop: 10}}>
                        <Text style={{marginTop: 8, fontSize: 20, color: "#000", fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center'}}>{this.state.selectMemberName}</Text>
                    </View>
                    
                </ScrollView>
                <Button
                    title="입력 완료"
                    buttonStyle={{backgroundColor: global.pointColor}}
                    titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                    onPress={this.resultRegisterRequest}/>
            </View>
        );
    }

    scheduleinfoRequest() {
        const scheduleID = this.props.navigation.getParam("scheduleID");

        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'schedule_ID': scheduleID
            })
        }
        let scheduleInfo = [];
        return fetch('http://' + global.appServerIp + '/schedule/detail', data)
            .then((response) => response.json())
            .then((responseJson) => {
                scheduleInfo = {
                    scheduleID: responseJson[0].schedule_ID,
                    scheduleName: responseJson[0].schedule_name,
                    gymName: responseJson[0].gym_name,
                    facName: responseJson[0].fac_name,
                    time: Util.ISOToDate(responseJson[0].starttime) + " " + Util.dateToTime(responseJson[0].starttime) + " ~ " + Util.dateToTime(responseJson[0].endtime),
                    MyTeamName: responseJson[0].reserv_team_name,
                    MyTeamID: responseJson[0].reserv_team_ID,
                    opponentTeamName: responseJson[0].opponent_team_name,
                    opponentTeamID: responseJson[0].opponent_team_ID,
                }
                this.setState({
                    scheduleInfo: scheduleInfo
                })

                console.log('ScheduleInfo: ', responseJson)
                this.playerListRequest(responseJson[0].schedule_ID);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    playerListRequest = (scheduleID) => {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'schedule_ID': scheduleID
            })
        }
        return fetch('http://' + global.appServerIp + '/schedule/joinmember', data)
            .then((response) => response.json())
            .then((responseJson) => {
                let list_A = [];
                let list_B = [];
                for (let i = 0; i < responseJson.length; i++) {
                    if (responseJson[i].UDID == global.UDID && responseJson[i].is_team_A == 1)
                        myTeam = 1
                    else if (responseJson[i].UDID == global.UDID && responseJson[i].is_team_A == 0)
                        myTeam = 2

                    if (responseJson[i].is_team_A == 1) {
                        list_A.push({
                            UDID: responseJson[i].UDID,
                            ID: responseJson[i].ID,
                            name: responseJson[i].name,
                            gender: responseJson[i].gender,
                            MMR: responseJson[i].MMR
                        });
                    }
                    else {
                        list_B.push({
                            UDID: responseJson[i].UDID,
                            ID: responseJson[i].ID,
                            name: responseJson[i].name,
                            gender: responseJson[i].gender,
                            MMR: responseJson[i].MMR
                        });
                    }
                }

                if (myTeam == 1) {
                    this.setState({
                        playerList: list_A,
                        spinner: false
                    });
                    console.log('Join MemberList Status Team A : ', list_A);
                }
                else {
                    this.setState({
                        playerList: list_B,
                        spinner: false
                    });
                    console.log('Join MemberList Status Team B : ', list_B);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    resultRegisterRequest = () => {
        console.log("하하", this.state.scheduleInfo)
        if(this.state.selectMemberUDID == ''){
            Alert.alert('ERROR', 'MVP를 선정해 주세요');
            return;
        }
        
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'schedule_ID': this.state.scheduleInfo.scheduleID,
                'reserv_score': this.state.reservScore,
                'opponent_score': this.state.opponentScore,
                'mvp_UDID': this.state.selectMemberUDID,
                'reserv_team_ID': this.state.scheduleInfo.MyTeamID,
                'opponent_team_ID': this.state.scheduleInfo.opponentTeamID,
                'UDID': global.UDID
            })
        }

        return fetch('http://' + global.appServerIp + '/schedule/regimatchresult', data)
            .then((response) => {
                console.log("Register Result : ", response)
                global.refresh = true;
                this.props.navigation.goBack();
            })
    }
}

function InputComponent(props) {
    const key = props.stateKey;
    return(
        <View style={[styles.inputContainer, {width: '80%'}, props.style]}>
            <Input style={styles.inputs}
                leftIcon={
                    <Icon
                        name={props.iconName}
                        size={24}
                        color={global.backgroundColor4}
                    />
                }
                leftIconContainerStyle={{marginRight: 20}}
                label={props.label}
                placeholder={props.placeholder}
                //keyboardType="email-address"
                onChangeText={(text) => props.updateText(key, text)}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        // width:350,
        height:100,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#909CA7'
    }
});