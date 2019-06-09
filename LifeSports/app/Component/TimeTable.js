import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Agenda } from 'react-native-calendars';
import Util from '../Component/Util'

export class TimeTable extends React.Component{
    constructor(props) {
        super(props);
        
        startDate = new Date();
        endDate = new Date();
        endDate.setDate(startDate.getDate() + 7)
        
        this.state = {
            date: '',
            items: {},
            marks: {},
            startDate: startDate,
            endDate: endDate
        }
    }

    componentDidMount() {
        this.setState({
            date: Util.GMTToDate(new Date()),
            items: {}
        })
        
        this.scheduleRequest();
    }

    render(){
        console.log("Start Render")
        return(
            <View style={{flex: 1, backgroundColor: global.backgroundColor, paddingBottom: 10}}>
                <Agenda
                    items={this.state.items}
                    // loadItemsForMonth={this.loadItems.bind(this)}
                    selected={this.state.date}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    minDate={this.state.startDate}
                    maxDate={this.state.endDate}
                />
            </View>
        )
    }

    scheduleRequest() {
        this.setState({
            items: []
        })
        let reservType, sportType = 1;
        if(this.props.statusList[0] == "예약")
            reservType = '/schedule/scheduletypereserv';
        else
            reservType = '/schedule/scheduletypematch';

        sportType = Util.sportType(this.props.statusList[1])    
        console.log(Util.GMTToDate(this.state.startDate), Util.GMTToDate(this.state.endDate), this.state.endDate)

        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'gym_ID' : this.props.gym_ID,
                'subj_ID' : sportType,
                'startdate': Util.GMTToDate(this.state.startDate),
                'enddate': Util.GMTToDate(this.state.endDate)
            })
        }
        console.log(data)
        return fetch('http://' + global.appServerIp + reservType, data)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                today = new Date();
                for(var i = 0; i < 7; i++){
                    this.state.items[Util.GMTToDate(today)] = [];
                    today.setDate(today.getDate() + 1);
                }
                for(var i = 0; i < responseJson.length; i++){
                    const strTime = Util.ISOToDate(responseJson[i].starttime)
                    if(responseJson[i].schedule_type != 3){
                        this.state.items[strTime].push({
                            scheduleID: responseJson[i].schedule_ID,
                            name: responseJson[i].schedule_name,
                            gymID : responseJson[i].gym_ID,
                            startTime: Util.dateToTime(responseJson[i].starttime),
                            endTime: Util.dateToTime(responseJson[i].endtime),
                            curStatus: responseJson[i].cur_status,
                            type: responseJson[i].schedule_type,
                            height: 120,
                            currentParticipant: responseJson[i].cur_participant,
                            maxParticipant: responseJson[i].max_participant,
                            MyTeamID: responseJson[i].reserv_team_ID,
                            MyTeamName: responseJson[i].reserv_team_name,
                            opponentTeamName: responseJson[i].opponent_team_name,
                            isSolo: responseJson[i].is_solo,
                            min_participant: responseJson[i].min_participant,
                        })
                    }
                    else{
                        this.state.items[strTime].push({
                            scheduleID: responseJson[i].schedule_ID,
                            name: responseJson[i].schedule_name,
                            gymID : responseJson[i].gym_ID,
                            startTime: Util.dateToTime(responseJson[i].starttime),
                            endTime: Util.dateToTime(responseJson[i].endtime),
                            curStatus: responseJson[i].cur_status,
                            type: responseJson[i].schedule_type,
                            height: 80,
                            currentParticipant: responseJson[i].cur_participant,
                            maxParticipant: responseJson[i].max_participant,
                            MyTeamName: responseJson[i].reserv_team_name,
                            opponentTeamName: responseJson[i].opponent_team_name,
                            isSolo: responseJson[i].is_solo,
                            min_participant: responseJson[i].min_participant,
                        })
                    }
                }
                const newItems = {};
                Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
                this.setState({
                    items: newItems
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onPressItem = (item, type) => {
        const statusList = this.props.statusList;
        const step = Number(this.props.step);
        statusList[step] = item.name;
        
        this.props.navigation.navigate("ReservationCheck", {"statusList": statusList, "step": Number(step)+1, "item": item, "type": type});
    }

    renderItem(item) {
        const typeColor = ["#4CAF50", "#FF9800", "#E91E63", "#2196F3"];
        const ratioColor = ["#388E3C", "#F57C00", "#C2185B", "#1976D2"];
        
        if(this.props.statusList[0] == "예약")
            reservType = true;
        else
            reservType = false;
            
        let ratio;
        if(!reservType)
            ratio = Math.round(Number(item.currentParticipant / item.maxParticipant) * 100) + '%'

        if(reservType){
            // avail, fill-solo, fill-duo-empty, fill-duo-fill, rest
            let type;
            if(reservType){
                if(item.type != 3){
                    if(item.curStatus == 0)
                        type = 1
                    else{
                        if(item.isSolo == 1)
                            type = 2
                        else{
                            if(item.opponentTeamName == undefined){
                                type = 3
                            }
                            else
                                type = 4
                        }
                    }
                }
                else
                    type = 5
            }

            if(type == 1){ // avail
                return(
                    <View style={[styles.item, {height: item.height, backgroundColor: typeColor[0]}]}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.onPressItem(item, type)}>
                            <Text style={styles.time}>{item.startTime} ~ {item.endTime}</Text>
                            <Text style={styles.title}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            else if(type == 2){ // fill-solo
                return(
                    <View style={[styles.item, {height: item.height, backgroundColor: typeColor[2]}]}>
                        <TouchableOpacity style={{flex: 1}}>
                            <Text style={styles.time}>{item.startTime} ~ {item.endTime}</Text>
                            <Text style={styles.title}>{item.name}</Text>
                            
                            <View style={{width: '100%', height: 37, top: 83, position: 'absolute', backgroundColor: ratioColor[2], justifyContent: 'center'}}>
                                <View style={{marginTop: 5, marginRight: 10}}>
                                    <Text style={styles.matching}>{item.MyTeamName}팀</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
            else if(type == 3){ // fill-duo-empty
                return(
                    <View style={[styles.item, {height: item.height, backgroundColor: typeColor[3]}]}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.onPressItem(item, type)}>
                            <Text style={styles.time}>{item.startTime} ~ {item.endTime}</Text>
                            <Text style={styles.title}>{item.name}</Text>
                            
                            <View style={{width: '100%', height: 37, top: 83, position: 'absolute', backgroundColor: ratioColor[3], justifyContent: 'center'}}>
                                <View style={{flexDirection: 'row', marginTop: 5, marginRight: 10}}>
                                    <View style={{flex: 1, alignItems: 'center'}}><Text style={styles.matching}>{item.MyTeamName}팀</Text></View>
                                    <View style={{flex: 0.3, alignItems: 'center'}}><Text style={styles.matching}>VS</Text></View>
                                    <View style={{flex: 1, alignItems: 'center'}}><Text style={styles.matching}></Text></View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
            else if(type == 4){ // fill-duo-fill
                return(
                    <View style={[styles.item, {height: item.height, backgroundColor: typeColor[2]}]}>
                        <TouchableOpacity style={{flex: 1}}>
                            <Text style={styles.time}>{item.startTime} ~ {item.endTime}</Text>
                            <Text style={styles.title}>{item.name}</Text>
                            
                            <View style={{width: '100%', height: 37, top: 83, position: 'absolute', backgroundColor: ratioColor[2], justifyContent: 'center'}}>
                                <View style={{flexDirection: 'row', marginTop: 5, marginRight: 10}}>
                                    <View style={{flex: 1, alignItems: 'center'}}><Text style={styles.matching}>{item.MyTeamName}팀</Text></View>
                                    <View style={{flex: 0.3, alignItems: 'center'}}><Text style={styles.matching}>VS</Text></View>
                                    <View style={{flex: 1, alignItems: 'center'}}><Text style={styles.matching}>{item.opponentTeamName}팀</Text></View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
            else{ // rest
                return(
                    <View style={[styles.item, {height: item.height, backgroundColor: typeColor[2]}]}>
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={styles.title}>이 날은 운영하지 않습니다</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
        else{
            return(
                <View style={[styles.item, {height: item.height, backgroundColor: typeColor[item.type - 1]}]}>
                    {
                        item.type != 3 ?
                            <TouchableOpacity style={{flex: 1}} onPress={()=>this.onPressItem(item)}>
                                <View style={{width: ratio, height: '100%', position: 'absolute', backgroundColor: ratioColor[item.type - 1]}}></View>
                                <Text style={styles.time}>{item.startTime} ~ {item.endTime}</Text>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.content}>{item.currentParticipant} / {item.maxParticipant}</Text>
                            </TouchableOpacity>
                        :
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={styles.title}>이 날은 운영하지 않습니다</Text>
                        </TouchableOpacity>
                    }
                </View> 
            )
        }
    }
    
    renderEmptyDate() {
        const typeColor = ["#4CAF50", "#FF9800", "#E91E63", "#2196F3"];
        return (
            <View style={[styles.item, {height: 80, backgroundColor: typeColor[2]}]}>
                <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.title}>일정이 없습니다</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        backgroundColor: '#f00',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    time: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#fff",
        marginTop: 12,
        marginBottom: 5,
        marginLeft: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fff",
        marginBottom: 5,
        marginLeft: 10
    },
    content: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#fff",
        marginBottom: 5,
        marginLeft: 10
    },
    matching: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#fff",
        marginBottom: 5,
        marginLeft: 10,
        textAlign: 'center',
        textAlignVertical: 'center'
    }
    
});