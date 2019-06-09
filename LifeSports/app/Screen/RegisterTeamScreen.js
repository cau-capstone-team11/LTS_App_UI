import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, ButtonGroup } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import {HeaderInfo} from '../Component/HeaderInfo'

export default class RegisterTeamScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    componentDidMount(){
        this.setState({
            name: '',
            duplicate: 1
        })
    }

    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
    }

    updateText = (key, text) => {
        this.setState({[key]: text})
    }

    onPressRegister = () => {
        
        if(this.state.duplicate == 1)
            Alert.alert('ERROR', '팀 명 중복 체크를 진행해주세요');

        else{
            this.registerTeamRequest()
            
        }
        
        // 종목 this.state.selectedIndex + 1
        //query
    }
    
    render() {
        const buttons = ['축구', '농구', '야구', '배드민턴']
        const { selectedIndex } = this.state

		return (
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle="팀 등록" navigation={this.props.navigation}></HeaderInfo>
                
                <ScrollView 
                    keyboardDismissMode='on-drag'
                    contentContainerStyle={styles.container}>
                    
                    <View style={{flexDirection: 'row'}}>
                        <InputComponent
                            iconName="user"
                            label="팀 명"
                            placeholder=""
                            stateKey="name"
                            updateText={this.updateText}
                            style={{width: 240}}
                        ></InputComponent>
                        <View style={{height: '100%', paddingTop: 40}}>
                            <Button
                                title="중복 체크"
                                buttonStyle={{backgroundColor: global.pointColor, borderRadius: 50, width: 100}}
                                titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                                onPress={this.checkNameDuplicate}/>
                        </View>
                    </View>

                    
                    
                    <View style={{width: '80%', height: 100, paddingTop: 40}}>
                            <Text style={styles.title}>주 종목</Text>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={selectedIndex}
                                buttons={buttons}
                                containerStyle={{width: '102%', height: 40, marginLeft: -1}}
                                buttonStyle={{backgroundColor: global.backgroundColor3}}
                                selectedButtonStyle={{backgroundColor: global.pointColor}}
                                selectedTextStyle={{color: '#000'}}
                                textStyle={{color: '#fff'}}
                                />
                    </View>
                    
                </ScrollView>
                <Button
                    title="등록하기"
                    buttonStyle={{backgroundColor: global.pointColor}}
                    titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 16}}
                    onPress={this.onPressRegister}/>
            </View>
        );
    }   
    
    checkNameDuplicate = () => {
        if(this.state.name == ''){
            Alert.alert('ERROR', 'ID를 입력해주세요');
            return;
        }
        
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'team_name' : this.state.name
            })
        }

        return fetch('http://' + global.appServerIp + '/team/checkdup', data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson[0].isduplicated == 0){
                    Alert.alert('OK', '사용 가능한 ID입니다.');
                    console.log('isDuplicated : ', responseJson[0].isduplicated)
                    this.setState({duplicate: responseJson[0].isduplicated})
                }
                else{
                    Alert.alert('ERROR', '이미 존재하는 ID입니다.');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    registerTeamRequest = () => {
        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'team_name' : this.state.name,
                'subj_ID': this.state.selectedIndex + 1,
                'UDID': global.UDID
            })
        }

        return fetch('http://' + global.appServerIp + '/team/create', data)
            .then((response) => {
                console.log("Register Team : ", response)
                global.hasLeader = 1;
                global.refresh = true;
                this.props.navigation.goBack();
            })
    }
}

function InputComponent(props) {
    const key = props.stateKey;
    return(
        <View style={[styles.inputContainer, props.style]}>
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
        width:350,
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