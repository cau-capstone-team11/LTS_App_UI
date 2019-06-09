import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import { Avatar, Divider, Icon } from "react-native-elements"
import { LineChart } from 'react-native-chart-kit'
import Carousel from 'react-native-snap-carousel'

import Util from './Util'

export class MemberProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ID: '',
            name: '',
            gender: '',
            mvpPoint: '',
            monthMatch: {
                m0: 0,
                m1: 0,
                m2: 0,
                m3: 0,
                m4: 0
            },
            ranking: '',
            users: [
                {UDID: '', MMR: '', figure: '', ranking: ''},
                {UDID: '', MMR: '', figure: '', ranking: ''},
                {UDID: '', MMR: '', figure: '', ranking: ''},
                {UDID: '', MMR: '', figure: '', ranking: ''},
                {UDID: '', MMR: '', figure: '', ranking: ''}
            ],
            totalMatch: '',
            winningRate: ''
        }
    }

    componentDidMount(){
        this.userInfoRequest();
    }

    

    _renderItem ({item, index}) {
        return (
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: global.backgroundColor3, alignItems: 'center', marginTop: 10, paddingRight: 25}}>
                <View style={{flex: 1.5, alignItems:'center'}}>
                    <Avatar
                        size='medium'
                        rounded
                        activeOpacity={0.7}
                        source={require('../Images/LDH.jpg')}
                    />
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Text style={{color: '#fff', fontSize: 18, marginBottom: 3}}>MMR</Text>
                    <Text style={{color: '#fff', fontSize: 18, marginTop: 3}}>순위</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Text style={{color: global.pointColor, fontSize: 21, fontWeight: 'bold', marginBottom: 2}}>{item.MMR}</Text>
                    <Text style={{color: global.pointColor, fontSize: 20, fontWeight: 'bold'}}>{item.ranking}위</Text>
                </View>
            </View>
        );
    }

    render(){
        const month = new Date().getMonth() + 1
        return(
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                {/* <ScrollView> */}
                    <View style={[styles.header, {backgroundColor: global.backgroundColor3}]}></View>
                    <Avatar
                        size="xlarge"
                        rounded
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        containerStyle={[styles.avatar, {width: 130, height: 130}]}
                        source={require('../Images/LDH.jpg')}
                        />
                        <View style={styles.nameView}>
                            <Icon
                                name={this.state.gender}
                                type='font-awesome'
                                size={21}
                                containerStyle={{marginTop: 6}}
                            />
                            <Text style={styles.name}>{this.props.player.name}</Text>
                        </View>
                    <View style={{height: 135}}></View>
                    
                    <View>
                        <Divider style={{backgroundColor: global.themeColor}}/>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, alignItems: 'center', paddingLeft: 50}}>
                                <Image style={styles.rankImage} source={Util.MMRToURL(this.props.player.MMR)}/>
                            </View>
                            <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center', paddingRight: 40, paddingTop: 5}}>
                                <Text style={styles.rankText}>{Util.MMRToName(this.props.player.MMR)}</Text>
                                <Text style={styles.MMR}>{this.props.player.MMR}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{marginTop: 30}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image style={styles.medalImage} source={require('../Images/Silver_Medal.png')}/>
                                <Text style={styles.medalText}>총 경기수</Text>
                                <Text style={[styles.medalText, {color: global.pointColor}]}>{this.state.totalMatch}회 달성</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image style={styles.medalImage} source={require('../Images/Gold_Medal.png')}/>
                                <Text style={styles.medalText}>최근 승률</Text>
                                <Text style={[styles.medalText, {color: global.pointColor}]}>{this.state.winningRate}%</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image style={styles.medalImage} source={require('../Images/Gold_Medal.png')}/>
                                <Text style={styles.medalText}>MVP 포인트</Text>
                                <Text style={[styles.medalText, {color: global.pointColor}]}>{this.state.mvpPoint}점</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{alignItems:'center'}}>
                        <Text style={styles.chartTitle}>월 별 경기수</Text>
                        <LineChart
                            data={{
                                labels: ['2월', '3월', '4월', '5월', '6월'],
                                datasets: [{
                                    data: [
                                        this.state.monthMatch.m4,
                                        this.state.monthMatch.m3,
                                        this.state.monthMatch.m2,
                                        this.state.monthMatch.m1,
                                        this.state.monthMatch.m0
                                    ],
                                    color: (opacity = 1) => `rgba(249, 170, 50, ${opacity})` // optional
                                }]
                            }}
                            width={Dimensions.get('window').width}
                            height={220}
                            chartConfig={{
                                backgroundGradientFrom: global.backgroundColor,
                                backgroundGradientTo: global.backgroundColor,
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(53, 72, 85, 1)`,
                                style: {
                                    borderRadius: 16
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                margin: 30
                            }}
                        />
                    </View>
                        
                    <View style={styles.carouselView}>
                        <Text style={styles.chartTitle}>현재 순위</Text>
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.users}
                            renderItem={this._renderItem}
                            sliderWidth={360}
                            itemWidth={256}
                            firstItem={2}
                        />      
                    </View>
                {/* </ScrollView> */}
            </View>
        );
    }

    userInfoRequest(){
        console.log("Prop User Info : ", this.props.player)
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'UDID' : this.props.player.UDID
            })
        }

        return fetch('http://' + global.appServerIp + '/user/userinfo', data)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(this.props.player.gender == 'M')
                    gender = 'mars';
                else
                    gender = 'venus';
                this.setState({
                    ID: responseJson[0].ID,
                    name: responseJson[0].name,
                    gender: gender,
                    birth: new Date(responseJson[0].birth),
                    figure: responseJson[0].profile_fig,
                    mvpPoint: responseJson[0].mvp_point,
                    monthMatch: {
                        m0: responseJson[0].month_0,
                        m1: responseJson[0].month_1,
                        m2: responseJson[0].month_2,
                        m3: responseJson[0].month_3,
                        m4: responseJson[0].month_4
                    },
                    ranking: responseJson[0].ranking,
                    users: [
                        {
                            UDID: responseJson[0].upper_user[0].UDID, 
                            figure: responseJson[0].upper_user[0].profile_fig,
                            MMR: responseJson[0].upper_user[0].MMR,
                            ranking: responseJson[0].ranking - 2
                        },
                        {
                            UDID: responseJson[0].upper_user[1].UDID, 
                            figure: responseJson[0].upper_user[1].profile_fig,
                            MMR: responseJson[0].upper_user[1].MMR,
                            ranking: responseJson[0].ranking - 1
                        },
                        {
                            UDID: this.props.player.UDID,
                            figure: responseJson[0].profile_fig,
                            MMR: this.props.player.MMR,
                            ranking: responseJson[0].ranking
                        },
                        {
                            UDID: responseJson[0].under_user[0].UDID, 
                            figure: responseJson[0].under_user[0].profile_fig,
                            MMR: responseJson[0].under_user[0].MMR,
                            ranking: responseJson[0].ranking + 1
                        },
                        {
                            UDID: responseJson[0].under_user[1].UDID, 
                            figure: responseJson[0].under_user[1].profile_fig,
                            MMR: responseJson[0].under_user[1].MMR,
                            ranking: responseJson[0].ranking + 2
                        }
                    ],
                    totalMatch: responseJson[0].total_match,
                    winningRate: responseJson[0].recent_winning_rate*100
                })                    

                console.log("User Info : ", responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }
}   

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#00BFFF",
        height: 140,
        marginTop: -1
    },
    avatar: {
        marginBottom: 10,
        alignSelf:'center',
        position: 'absolute',
        marginTop: 70
    },
    nameView: {
        marginBottom: 0,
        alignSelf:'center',
        position: 'absolute',
        marginTop: 220,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    name: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
        marginLeft: 10
    },
    rankImage: {
        width: 120,
        height: 120,
        marginLeft: 30
    },
    rankText: {
        fontSize: 34,
        fontWeight: 'bold'
    },
    MMR: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    medalImage:{
        width: 60,
        height: 60,
        marginBottom: 5
    },
    medalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 30
    },
    carouselView: {
        width: '100%',
        height: 150,
        marginBottom: 30,
        alignItems: 'center'
    }
});