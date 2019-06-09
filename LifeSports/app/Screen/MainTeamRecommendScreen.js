import React from "react";
import { View, ActivityIndicator, StyleSheet, Text, ScrollView } from "react-native";
import { Card, ListItem, Icon, Button, SearchBar } from "react-native-elements"

import {HeaderInfo} from '../Component/HeaderInfo'
import {ImageCard} from '../Component/ImageCard'

export default class MainTeamRecommendScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: "팀 추천",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="star" size={25} type="font-awesome" color={tintColor} />
        )
    }

    constructor(props){
		super(props);
		this.state ={
            teamInfo: [],
            search: '',
            spinner: false,
            spinnerRecommend: false,
            recommendTeam: []
		}
	}
	
	componentDidMount(){
		this.setState({
            teamInfo: [],
            search: '',
            spinner: false,
            spinnerRecommend: false,
            recommendTeam: []
        });
        this.recommendTeamRequest();

        this.focusListener = this.props.navigation.addListener('willFocus', () => {
            global.refresh = false;
            this.setState({
                teamInfo: [],
                recommendTeam: []
            })
            this.recommendTeamRequest();
		})
    }
    
	onPressReservationStatus = () => {
		this.props.navigation.navigate("ReservationStatus");
	}
    
	onPressMatchingStatus = () => {
		this.props.navigation.navigate("MatchingStatus");
    }
    
    onPressJoinBtn = (item) => {
        this.props.navigation.navigate("TeamInfo", {'MyTeamInfo': item, "headerTitle": "팀원 목록"});
    }

    updateSearch = search => {
        if(global.UDID != ''){
            this.setState({search});
            console.log(search)
            if(search != '')
                this.teamInfoRequest(search);
        }
    };

    renderRecommendTeam() {
        return this.state.recommendTeam.map((item) => {
            return (
                <ImageCard
                    imagePath={require('../Images/team1.jpg')}
                    title={item.name}
                    detail='대한민국 엘리트 멤버들이 모였다. 축구는 머리로 하는 것이다!'
                    btnTitle='가입하기'
                    onPressBtn={()=>this.onPressJoinBtn(item)}
                ></ImageCard>
            );
        });
    }

    renderTeam() {
        return this.state.teamInfo.map((item) => {
            return (
                <ImageCard
                    imagePath={require('../Images/team1.jpg')}
                    title={item.name}
                    detail='대한민국 엘리트 멤버들이 모였다. 축구는 머리로 하는 것이다!'
                    btnTitle='가입하기'
                    onPressBtn={()=>this.onPressJoinBtn(item)}
                ></ImageCard>
            );
        });
    }

	render() {
        const { search } = this.state;
        if(search == ''){
            return (
                <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                    <HeaderInfo headerTitle="메인" navigation={this.props.navigation}></HeaderInfo>
                    <SearchBar
                        containerStyle={{marginTop: -1, backgroundColor: global.backgroundColor3}}
                        inputContainerStyle={{marginTop: -1, height: 30, backgroundColor: global.backgroundColor3}}
                        inputStyle={{fontSize: 16, marginTop: 3}}
                        placeholder="새로운 팀 찾기"
                        onChangeText={this.updateSearch}
                        value={search}
                    />
                    <View style={{flex: 1}}>
                        <Text style={{textAlign: 'center', alignSelf:'center', marginTop: 15, textSize: 24, color: '#000'}}>추천 팀 목록</Text>
                        <ScrollView>
                            {
                            this.state.spinnerRecommend ?
                            (
                                <View style={{marginTop: 30}}>
                                    <ActivityIndicator size="large" color={global.pointColor}/>
                                </View>
                            ) : (
                                this.renderRecommendTeam()
                            )
                            }
                        </ScrollView>
                    </View>
                </View>  
            );
        }
        else{
            return (
                <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                    <HeaderInfo headerTitle="메인" navigation={this.props.navigation}></HeaderInfo>
                    <SearchBar
                        containerStyle={{marginTop: -1, backgroundColor: global.backgroundColor3}}
                        inputContainerStyle={{marginTop: -1, height: 30, backgroundColor: global.backgroundColor3}}
                        inputStyle={{fontSize: 16, marginTop: 3}}
                        placeholder="새로운 팀 찾기"
                        onChangeText={this.updateSearch}
                        value={search}
                    />
                    <View style={{flex: 1}}>
                        <ScrollView>
                            {
                            this.state.spinner ?
                            (
                                <View style={{marginTop: 30}}>
                                    <ActivityIndicator size="large" color={global.pointColor}/>
                                </View>
                            ) : (
                                this.state.exist ? 
                                    this.renderTeam()
                                :
                                <View style={{marginTop: 50, alignContent: 'center'}}>
                                    <Text style={styles.exist}>검색 결과가 존재하지 않습니다</Text>
                                </View>
                            )
                            }
                        </ScrollView>
                    </View>
                </View>  
            );
        }
    }
    
    teamInfoRequest = (search) => {
        this.setState({spinner: true})
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'searchword' : search
            })
        }
        let teamInfo = []
        return fetch('http://' + global.appServerIp + '/team/teamsearch', data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.length > 0){
                    global.hasTeam = true;
                    this.setState({teamCount : responseJson.length});
                }
                for(var i = 0; i < responseJson.length; i++){
                    side = i % 2

                    teamInfo.push({
                        ID: responseJson[i].team_ID,
                        name: responseJson[i].team_name,
                        MMR: responseJson[i].team_MMR,
                        winRate: responseJson[i].winning_rate,
                        mainSubj: responseJson[i].team_main_subj
                    });
                }

                if(responseJson.length != 0){
                    this.setState({
                        teamInfo: teamInfo,
                        exist: true,
                        spinner: false
                    })
                }
                else{
                    this.setState({
                        teamInfo: teamInfo,
                        exist: false,
                        spinner: false
                    })
                }

                console.log('Search TeamInfo: ', responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    recommendTeamRequest = () => {
        this.setState({spinnerRecommend: true})
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
        let recommendTeam = []
        return fetch('http://' + global.appServerIp + '/team/recommended', data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.length > 0){
                    global.hasTeam = true;
                    this.setState({teamCount : responseJson.length});
                }
                for(var i = 0; i < responseJson.length; i++){
                    recommendTeam.push({
                        ID: responseJson[i].team_ID,
                        name: responseJson[i].team_name
                    });
                }

                this.setState({
                    recommendTeam: recommendTeam,
                    spinnerRecommend: false
                })

                console.log('Recommend TeamInfo: ', responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }
}


const styles = StyleSheet.create({
	exist: {
        fontSize: 16,
        textAlign: 'center'
    }
});