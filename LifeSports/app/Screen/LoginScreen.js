import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    TextInput,
    Button,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SecureStore } from 'expo';
import {HeaderInfo} from '../Component/HeaderInfo'

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        state = {
        }
    }

    componentDidMount(){
        this.setState({
            id : '',
            password: ''
        })
    }

    storeLoginInfo = async () => {
        const username = this.state.id;
        const password = this.state.password;

        SecureStore.setItemAsync("id", username);
        SecureStore.setItemAsync("password", password);
    }

    onPressLogin = () => {
        if(this.state.id == ''){
            Alert.alert('ERROR', 'ID를 입력해주세요');
            return;
        }
        else if(this.state.password == ''){
            Alert.alert('ERROR', '비밀번호를 입력해주세요');
            return;
        }

        let data = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                'ID' : this.state.id,
                'PWD' : this.state.password
            })
        }

        return fetch('http://' + global.appServerIp + '/user/login', data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson[0] == undefined){
                    Alert.alert('ERROR', 'ID나 비밀번호가 맞지 않습니다');
                }
                else{
                    global.UDID = responseJson[0].UDID;
                    global.ID = responseJson[0].ID;
                    global.name = responseJson[0].name;
                    global.MMR = responseJson[0].MMR;
                    global.gender = responseJson[0].gender;
                    global.loginStatus = true;
                    global.refresh = true;
                    global.hasLeader = responseJson[0].isLeader;
                    this.props.navigation.popToTop();
                    this.storeLoginInfo();
                }

                console.log('User Login Info : ', responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onPressRegister = () => {
        this.props.navigation.navigate("Register");
    }

    render() {
        return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <HeaderInfo headerTitle="로그인" navigation={this.props.navigation}></HeaderInfo>
            <View style={[styles.container, {backgroundColor: global.backgroundColor}]}>
                
                <View style={{flex: 2}}>
                    
                </View>


                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
                    <TextInput style={styles.inputs}
                        placeholder="ID"
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        onChangeText={(id) => this.setState({id})}/>
                </View>
                
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
                    <TextInput style={styles.inputs}
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(password) => this.setState({password})}/>
                </View>

                <TouchableOpacity style={[styles.buttonContainer, styles.loginButton, {backgroundColor: global.pointColor}]} onPress={() => this.onPressLogin()}>
                    <Text style={[styles.loginText, {color: "#000"}]}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onPressRegister()}>
                    <Text style={{color: global.backgroundColor4, fontSize: 16}}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        width:30,
        height:30,
        marginLeft:15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    loginText: {
        fontSize: 16
    }
});