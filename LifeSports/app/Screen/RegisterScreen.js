import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Input, Button, ButtonGroup } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import {HeaderInfo} from '../Component/HeaderInfo'

export default class Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            password: '',
            tel: '',
            duplicate: 1,
            sports: 0,
            gender: 0
        }
        this.updateSports = this.updateSports.bind(this)
        this.updateGender = this.updateGender.bind(this)
    }

    componentDidMount(){
        this.setState({
            id: '',
            name: '',
            password: '',
            tel: '',
            sports: 0,
            gender: 0,
            duplicate: 1
        })
    }

    updateSports(sports) {
        this.setState({sports})
    }

    updateGender(gender) {
        this.setState({gender})
    }

    updateText = (key, text) => {
        this.setState({[key]: text})
    }

    onPressNextStep = () => {
        // if(this.state.id == '')
        //     Alert.alert('ERROR', 'ID를 입력해 주세요');
        // else if(this.state.name == '')
        //     Alert.alert('ERROR', '이름을 입력해 주세요');
        // else if(this.state.password == '')
        //     Alert.alert('ERROR', '비밀번호를 입력해 주세요');
        // else if(this.state.duplicate == 1)
        //     Alert.alert('ERROR', 'ID 중복 체크를 진행해주세요');
        // else
            this.props.navigation.navigate("Register2", {state: this.state});   
    }

    render() {
        const sportButtons = ['축구', '농구', '야구', '배드민턴']
        const genderButtons = ['남성', '여성']
        const { sports } = this.state
        const { gender } = this.state
		return (
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle="회원 가입" navigation={this.props.navigation}></HeaderInfo>
                <ScrollView 
                    keyboardDismissMode='on-drag'
                    contentContainerStyle={styles.container}>
                    <View style={{flexDirection: 'row', width: '80%'}}>
                        <InputComponent
                            iconName="user"
                            label="ID"
                            placeholder=""
                            stateKey="id"
                            updateText={this.updateText}
                            style={{width: '65%'}}
                        ></InputComponent>
                        <View style={{height: '100%', paddingTop: 40}}>
                            <Button
                                title="중복 체크"
                                buttonStyle={{backgroundColor: global.pointColor, borderRadius: 50, width: 100}}
                                titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                                onPress={this.checkIdDuplicate}/>
                        </View>
                    </View>

                    <InputComponent
                        iconName="unlock-alt"
                        label="비밀번호"
                        placeholder=""
                        stateKey="password"
                        updateText={this.updateText}
                    ></InputComponent>

                    <InputComponent
                        iconName="user"
                        label="이름"
                        placeholder=""
                        stateKey="name"
                        updateText={this.updateText}
                    ></InputComponent>
                    
                    <View style={{width: '80%', height: 100, paddingTop: 10}}>
                            <Text style={styles.title}>성별</Text>
                            <ButtonGroup
                                onPress={this.updateGender}
                                selectedIndex={gender}
                                buttons={genderButtons}
                                containerStyle={{width: '102%', height: 40, marginLeft: -1}}
                                buttonStyle={{backgroundColor: global.backgroundColor3}}
                                selectedButtonStyle={{backgroundColor: global.pointColor}}
                                selectedTextStyle={{color: '#000'}}
                                textStyle={{color: '#fff'}}
                                />
                    </View>

                    <View style={{width: '80%', height: 100, paddingTop: 10}}>
                            <Text style={styles.title}>선호 종목</Text>
                            <ButtonGroup
                                onPress={this.updateSports}
                                selectedIndex={sports}
                                buttons={sportButtons}
                                containerStyle={{width: '102%', height: 40, marginLeft: -1}}
                                buttonStyle={{backgroundColor: global.backgroundColor3}}
                                selectedButtonStyle={{backgroundColor: global.pointColor}}
                                selectedTextStyle={{color: '#000'}}
                                textStyle={{color: '#fff'}}
                                />
                    </View>
                </ScrollView>
                <Button
                    title="Next Step"
                    buttonStyle={{backgroundColor: global.pointColor}}
                    titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                    onPress={this.onPressNextStep}/>
            </View>
        );
    }

    checkIdDuplicate = () => {
        if(this.state.id == ''){
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
                'ID' : this.state.id
            })
        }

        return fetch('http://' + global.appServerIp + '/user/checkdup', data)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson[0].isduplicated == 0){
                    Alert.alert('OK', '사용 가능한 ID입니다.');
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