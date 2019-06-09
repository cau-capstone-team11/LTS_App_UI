import React, {Component} from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements"

import {HeaderInfo} from '../Component/HeaderInfo'
import {MyMapView} from '../Component/MyMapView'
import Util from '../Component/Util'

export default class MatchingStatusScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            scheduleInfo:{}
        }
    }

    componentDidMount() {
        this.scheduleinfoRequest();
    }

    onPressJoinListBtn = () => {
        this.props.navigation.navigate("DivideTeam", {"id": this.state.scheduleInfo.ID, "headerTitle": "참여자 목록"});
    }

    render(){
        const detailViewStyle = StyleSheet.create({
            detailView: {
                flex: 1,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 15,
                paddingRight: 15,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                width: '100%',
                backgroundColor: global.backgroundColor3
            }
        });

        return(
            <View style={{flex: 1}}>
                <HeaderInfo headerTitle="매칭 정보" navigation={this.props.navigation}></HeaderInfo>
                <View style={{flex: 1}}>
                    <MyMapView
                        gyminfoRequest={this.gyminfoRequest}
                        scheduleID={this.props.navigation.getParam("scheduleID")}/>
                </View>

                <View style={{flex: 2}}>
                    <View style={detailViewStyle.detailView}>
                        <View style={{height: 35, flexDirection: 'row', marginBottom: 10}}>
                            <Text style={styles.Header} adjustsFontSizeToFit={true} numberOfLines={1}>{this.state.scheduleInfo.scheduleName}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <Text style={styles.Title}>체육관</Text>
                                <Text style={styles.Title}>시설명</Text>
                                <Text style={styles.Title}>주소</Text>
                                <Text style={styles.Title}>예약 일시</Text>
                                <Text style={styles.Title}>종목</Text>
                                <Text style={styles.Title}>참여 인원</Text>
                            </View>
                            <View style={{flex: 4}}>
                                <Text style={styles.Detail}>{this.state.scheduleInfo.gymName}</Text>
                                <Text style={styles.Detail}>{this.state.scheduleInfo.facName}</Text>
                                <Text style={styles.Detail}>{this.state.scheduleInfo.address}</Text>
                                <Text style={styles.Detail}>{this.state.scheduleInfo.time}</Text>
                                <Text style={styles.Detail}>{this.state.scheduleInfo.subject}</Text>
                                <View style={{flexDirection: 'row', flex: 1}}>
                                    {
                                        this.state.scheduleInfo.avail ? 
                                            <Text style={[styles.Detail, {color: '#76FF03'}]}>{this.state.scheduleInfo.participant}</Text>
                                        :
                                            <Text style={[styles.Detail, {color: '#F50057'}]}>{this.state.scheduleInfo.participant}</Text>
                                    }
                                    <Button title="참가자 목록"
                                        buttonStyle={{width: 130, height: 35, backgroundColor: global.pointColor, marginTop: 10}}
                                        titleStyle={{color: "#000", fontWeight: 'bold'}}
                                        onPress={this.onPressJoinListBtn}></Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    
    gyminfoRequest(that, scheduleID) {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'schedule_ID' : scheduleID
            })
        }

        let gymInfo = [];
        return fetch('http://' + global.appServerIp + '/schedule/detail', data)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                for(var i = 0; i < responseJson.length; i++){
                    gymInfo.push({
                        key: responseJson[i].gym_ID,
                        coordinate: {
                            latitude: responseJson[i].gym_latitude,
                            longitude: responseJson[i].gym_longitude
                        }                                
                    })
                }
                that.setState({
                    markers: gymInfo
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    scheduleinfoRequest() {
        const scheduleID = this.props.navigation.getParam("scheduleID");
        console.log(scheduleID)
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'schedule_ID' : scheduleID
            })
        }
        let scheduleInfo = [];
        return fetch('http://' + global.appServerIp + '/schedule/detail', data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson[0].cur_participant < responseJson[0].min_participant)
                    avail = false
                else
                    avail = true

                scheduleInfo={
                    ID: responseJson[0].schedule_ID,
                    scheduleName: responseJson[0].schedule_name,
                    gymName: responseJson[0].gym_name,
                    facName: responseJson[0].fac_name,
                    address: responseJson[0].gym_location,
                    time: Util.ISOToDate(responseJson[0].starttime) + " " + Util.dateToTime(responseJson[0].starttime) + " ~ " + Util.dateToTime(responseJson[0].endtime),
                    subject: Util.sportTypeToName(responseJson[0].subj_ID),
                    participant: responseJson[0].cur_participant + " / " + responseJson[0].max_participant,
                    avail: avail
                }
                this.setState({
                    scheduleInfo: scheduleInfo
                })

                console.log('ScheduleInfo: ', responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

const styles = StyleSheet.create({
    Header: {
        height: 35,
        flex: 1,
        fontWeight: 'bold',
        fontSize: 20,
        textAlignVertical: 'center',
        color: "#fff"
    },
    Title: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: "#fff"
    },
    Icon:{
        paddingTop: 5,
        marginRight: 20
    },
    Detail: {
        paddingLeft: 15,
        flex: 1,
        fontSize: 16,
        textAlignVertical: 'center',
        color: "#fff"
    },
    nextBtn:{
    }
});