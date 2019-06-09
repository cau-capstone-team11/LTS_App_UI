import React, {Component} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button, ButtonGroup } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import {HeaderInfo} from '../Component/HeaderInfo'

export default class RegisterScreen2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainFoot: 0,
            mainRole: 0,
            skill: 0,
            career: 0
        }
        this.updateMainFoot = this.updateMainFoot.bind(this)
        this.updateMainRole = this.updateMainRole.bind(this)
        this.updateSkill = this.updateSkill.bind(this)
        this.updateCareer = this.updateCareer.bind(this)
        this.registerRequest = this.registerRequest.bind(this)
    }

    componentDidMount(){
        const state = this.props.navigation.getParam("state");
        this.setState(state)
    }
    
    updateMainFoot(mainFoot) {
        this.setState({mainFoot})
    }

    updateMainRole(mainRole) {
        this.setState({mainRole})
    }
    
    updateSkill(skill) {
        this.setState({skill})
    }

    updateCareer(career) {
        this.setState({career})
    }

    render() {
        const mainFootButtons = ['오른발', '왼발']
        const mainRoleButtons = ['GK', 'FW', 'MF', 'DF']
        const skillButtons = ['하', '중', '상', '최상']
        const careerButtons = ['1년 이하', '1~3년', '3~5년', '10년 이상']
        const { mainFoot } = this.state
        const { mainRole } = this.state
        const { skill } = this.state
        const { career } = this.state
        

		return (
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle="회원 가입" navigation={this.props.navigation}></HeaderInfo>
                
                <View style={styles.container}>
                    <View style={{width: '80%', height: 100, paddingTop: 10}}>
                            <Text style={styles.title}>주 발</Text>
                            <ButtonGroup
                                onPress={this.updateMainFoot}
                                selectedIndex={mainFoot}
                                buttons={mainFootButtons}
                                containerStyle={{width: '102%', height: 40, marginLeft: -1}}
                                buttonStyle={{backgroundColor: global.backgroundColor3}}
                                selectedButtonStyle={{backgroundColor: global.pointColor}}
                                selectedTextStyle={{color: '#000'}}
                                textStyle={{color: '#fff'}}
                                />
                    </View>

                    <View style={{width: '80%', height: 100, paddingTop: 10}}>
                            <Text style={styles.title}>주 포지션</Text>
                            <ButtonGroup
                                onPress={this.updateMainRole}
                                selectedIndex={mainRole}
                                buttons={mainRoleButtons}
                                containerStyle={{width: '102%', height: 40, marginLeft: -1}}
                                buttonStyle={{backgroundColor: global.backgroundColor3}}
                                selectedButtonStyle={{backgroundColor: global.pointColor}}
                                selectedTextStyle={{color: '#000'}}
                                textStyle={{color: '#fff'}}
                                />
                    </View>

                    <View style={{width: '80%', height: 100, paddingTop: 10}}>
                            <Text style={styles.title}>실력</Text>
                            <ButtonGroup
                                onPress={this.updateSkill}
                                selectedIndex={skill}
                                buttons={skillButtons}
                                containerStyle={{width: '102%', height: 40, marginLeft: -1}}
                                buttonStyle={{backgroundColor: global.backgroundColor3}}
                                selectedButtonStyle={{backgroundColor: global.pointColor}}
                                selectedTextStyle={{color: '#000'}}
                                textStyle={{color: '#fff'}}
                                />
                    </View>

                    <View style={{width: '80%', height: 100, paddingTop: 10}}>
                            <Text style={styles.title}>경력</Text>
                            <ButtonGroup
                                onPress={this.updateCareer}
                                selectedIndex={career}
                                buttons={careerButtons}
                                containerStyle={{width: '102%', height: 40, marginLeft: -1}}
                                buttonStyle={{backgroundColor: global.backgroundColor3}}
                                selectedButtonStyle={{backgroundColor: global.pointColor}}
                                selectedTextStyle={{color: '#000'}}
                                textStyle={{color: '#fff'}}
                                />
                    </View>
                </View>
                <Button
                    title="회원 가입"
                    buttonStyle={{backgroundColor: global.pointColor}}
                    titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                    onPress={this.registerRequest}/>
            </View>
        );
    }

    registerRequest(){
        console.log("하하")
        if(this.state.gender == 0) 
            gender = 'M'
        else
            gender = 'W'

        if(this.state.mainFoot == 0)
            mainFoot = 'R'
        else
            mainFoot = 'L'

        if(this.state.mainRole == 0)
            mainRole = 'GK'
        else if(this.state.mainRole == 1)
            mainRole = 'FW'
        else if(this.state.mainRole == 2)
            mainRole = 'MF'
        else if(this.state.mainRole == 3)
            mainRole = 'DF'

        if(this.state.skill == 0)
            skill = '하'
        else if(this.state.skill == 1)
            skill = '중'
        else if(this.state.skill == 2)
            skill = '상'
        else if(this.state.skill == 3)
            skill = '최상'
        
        if(this.state.career == 0)
            career = 1
        else if(this.state.career == 1)
            career = 3
        else if(this.state.career == 2)
            career = 5
        else if(this.state.career == 3)
            career = 10

        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'ID' : this.state.id,
                'name': this.state.name,
                'PWD': this.state.password,
                'gender': gender,
                'mainFoot': mainFoot,
                'mainRole': mainRole,
                'skill': skill,
                'career': career
            })
        }

        return fetch('http://' + global.appServerIp + '/user/regiuser', data)
            .then((response) => {
                console.log("Register User : ", response)
                global.refresh = true;
                this.props.navigation.popToTop();
            })
    }
}

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