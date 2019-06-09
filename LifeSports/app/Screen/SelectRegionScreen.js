import React, {Component} from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Button } from 'react-native-elements'

import {HeaderInfo} from '../Component/HeaderInfo'
import {SelectStatus} from '../Component/SelectStatus'
import {MyMapView} from '../Component/MyMapView'
import Util from '../Component/Util'

export default class SelectRegionScreen extends Component {
    constructor(props) {
        super(props);
        this.showDetailView = this.showDetailView.bind(this);
        this.hideDetailView = this.hideDetailView.bind(this);
        this.state = {
            showDetail: false,
            modalVisible: false,
            gymInfo: {
            }
        };
    }

    showDetailView = () => this.setState({ modalVisible: true })
    hideDetailView = () => this.setState({ modalVisible: false })
    toggleFavorite = () => {
        this.updateFavorite();
    }

    hasFavoriteGym = () => {
        //for(let i = 0; i < this.state.favori
    }

    

    render() {
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

        const statusList = this.props.navigation.getParam("statusList");
        const step = this.props.navigation.getParam("step");

		return (  
			<View style={{flex: 1}}>
				<HeaderInfo headerTitle="체육관 선택" navigation={this.props.navigation}></HeaderInfo>
                <SelectStatus statusList={statusList}></SelectStatus>
                
                <View>
                    <ListItem
                        title="자주 가는 체육관"
                        chevron
                        onPress={()=>{
                            this.props.navigation.navigate("FavoriteGymList", {"statusList": statusList, "step": Number(step)});
                        }}
                        containerStyle={{backgroundColor: global.backgroundColor3}}
                        titleStyle={{color: "#fff"}}
                    />
                </View>

                <MyMapView
                    showDetail={this.showDetailView}
                    hideDetail={this.hideDetailView}
                    updateGymInfo={this.updateGymInfo}
                    statusList={statusList}
                    gyminfoRequest={this.gyminfoRequest}/>

                <Modal animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={()=>{this.hideDetailView()}}>
                    <View style={{flex: 5}}> 
                        <TouchableOpacity
                            style={{flex: 1}}
                            onPress={this.hideDetailView}></TouchableOpacity>
                    </View>
                    <View style={detailViewStyle.detailView}>
                        <View style={{height: 35, flexDirection: 'row', marginBottom: 5}}>
                            <Text style={styles.Header} adjustsFontSizeToFit={true} numberOfLines={1}>{this.state.gymInfo.title}</Text>
                            {
                                this.state.gymInfo.favorite ?
                                <Icon iconStyle={styles.Icon} name='favorite' color="#f40057"
                                    onPress={this.toggleFavorite}></Icon>
                                :
                                <Icon iconStyle={styles.Icon} name='favorite-border'
                                    onPress={this.toggleFavorite}></Icon>
                            }
                            
                            <Button
                                title="NEXT STEP"
                                buttonStyle={{backgroundColor: global.pointColor}}
                                titleStyle={{color: "#000"}}
                                onPress={()=>{
                                    this.hideDetailView();
                                    statusList[step] = this.state.gymInfo.title;
                                    this.props.navigation.navigate("SelectPlan", {"statusList": statusList, "step": Number(step)+1, "gym_ID" : this.state.gymInfo.gym_ID});
                                }}
                            />
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                                <Text style={styles.Title}>소개</Text>
                                <Text style={styles.Title}>주소</Text>
                                <Text style={styles.Title}>운영 시간</Text>
                            </View>
                            <View style={{flex: 4}}>
                                <Text style={styles.Detail}>{this.state.gymInfo.detail}</Text>
                                <Text style={styles.Detail}>{this.state.gymInfo.address}</Text>
                                <Text style={styles.Detail}>{this.state.gymInfo.openTime}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
			</View>
		);
    }
    
    updateGymInfo = (gym_ID) => {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'gym_ID' : gym_ID,
                'UDID' : global.UDID
            })
        }

        return fetch('http://' + global.appServerIp + '/gym/gyminfo', data)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({
                    gymInfo: {
                        gym_ID: responseJson[0].gym_ID,
                        title: responseJson[0].gym_name,
                        detail: responseJson[0].gym_info,
                        address: responseJson[0].gym_location,
                        openTime: responseJson[0].avail_starttime + '~' + responseJson[0].avail_endtime,
                        favorite: responseJson[0].isfavorite
                    }
                });

                this.forceUpdate();

                console.log('gymInfo : ', this.state.gymInfo)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateFavorite = () => {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'gym_ID' : this.state.gymInfo.gym_ID,
                'UDID' : global.UDID
            })
        }

        if(this.state.gymInfo.favorite == 1){
            fetch('http://' + global.appServerIp + '/gym/favoritedel', data)
            .then((response) => {
                console.log(response)
                this.updateGymInfo(this.state.gymInfo.gym_ID)
            })
        }
        else{
            fetch('http://' + global.appServerIp + '/gym/favoriteins', data)
            .then((response) => {
                console.log(response)
                this.updateGymInfo(this.state.gymInfo.gym_ID)
            })
        }
        return
    }

    gyminfoRequest(sportType, that) {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'subj_ID' : sportType
            })
        }
        let gymInfoList = [];
        return fetch('http://' + global.appServerIp + '/gym/gymbysport', data)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                for(var i = 0; i < responseJson.length; i++){
                    gymInfoList.push({
                        key: responseJson[i].gym_ID,
                        coordinate: {
                            latitude: responseJson[i].gym_latitude,
                            longitude: responseJson[i].gym_longitude
                        }                                
                    })
                    
                }
                that.setState({
                    markers: gymInfoList
                })
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
        fontSize: 14,
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
        fontSize: 14,
        textAlignVertical: 'center',
        color: "#fff"
    },
    nextBtn:{
    }
});