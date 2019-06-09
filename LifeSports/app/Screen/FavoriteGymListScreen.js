import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Card } from 'react-native-elements'

import {HeaderInfo} from '../Component/HeaderInfo'
import Util from '../Component/Util'

export default class FavoriteGymListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            favoriteGymList: [
            ]
        }
    }

    componentDidMount(){
        this.getFavoriteList();
    }    

    onEndReached = () => {
        this.setState(state => ({
            data: [
                ...state.data,
            ]
        }));
    };

    // onRefresh = () => {
    //     this.setState({
    //         data: {
    //             key: '1',
    //             name: '국사봉 체육관2',
    //             address: '동작구 상도동 123-12'
    //         }
    //     });
    // }

    nextPage = (gym) => {
        const statusList = this.props.navigation.getParam("statusList");
        const step = this.props.navigation.getParam("step");
        statusList[step] = gym.name;
        this.props.navigation.navigate("SelectPlan", {"statusList": statusList, "step": Number(step)+1, "gym_ID": gym.gym_ID});
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle="즐겨찾기" navigation={this.props.navigation}></HeaderInfo>
                <View style={{flex: 1}}>
                {
                    this.state.favoriteGymList.map((gym, i) => (
                        <Card
                            containerStyle={{padding: 0}}>
                            <ListItem
                                key={i}
                                roundAvatar
                                title={gym.name}
                                subtitle={gym.address}
                                chevron
                                titleStyle={{color: "#000", fontWeight: 'bold', marginBottom: 5}}
                                subtitleStyle={{color: "#000"}}
                                onPress={()=>this.nextPage(gym)}
                            />
                        </Card>
                    ))
                }
                </View>
            </View>
        );
    }

    
    getFavoriteList = () => {
        const statusList = this.props.navigation.getParam("statusList");
        sportType = Util.sportType(statusList[1]);

        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'UDID' : global.UDID,
                'subj_ID': sportType
            })
        }
        return fetch('http://' + global.appServerIp + '/gym/favorite', data)
            .then((response) => response.json())
            .then((responseJson) => {
                let list = [];
                for(let i = 0; i < responseJson.length; i++){
                    list.push({
                        gym_ID: responseJson[i].gym_ID,
                        name: responseJson[i].gym_name,
                        address: responseJson[i].gym_location
                    });
                }

                this.setState({
                    favoriteGymList : list
                });
                console.log('favorite List : ', list);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}