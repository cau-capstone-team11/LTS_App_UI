import React, {Component} from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Card, Rating } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import {HeaderInfo} from '../Component/HeaderInfo'

export default class RatingGameScreen extends Component {
    constructor(props) {
        super(props);
        state = {
        }
    }

    componentDidMount(){
        this.setState({
            id: '',
            name: '',
            password: '',
            email: '',
            duplicate: false
        })
    }

    updateText = (key, text) => {
        this.setState({[key]: text})
    }

    onPressSubmit = () => {
        this.props.navigation.navigate("Register2", {state: this.state});
    }

    render() {
		return (
            <View style={{flex: 1, backgroundColor: global.backgroundColor}}>
                <HeaderInfo headerTitle="회원 가입" navigation={this.props.navigation}></HeaderInfo>
                
                <ScrollView>
                    <Card 
                        title='경기 만족도'
                        titleStyle={{fontSize: 24, color: '#000'}}>
                        <Rating
                            showRating
                            fractions={1}
                        />
                    </Card>
                    <Card 
                        title='경기 만족도'
                        titleStyle={{fontSize: 24, color: '#000'}}>
                        <Rating
                            showRating
                            fractions={1}
                        />
                    </Card>
                    <Card   
                        title='경기 만족도'
                        titleStyle={{fontSize: 24, color: '#000'}}>
                        <Rating
                            showRating
                            fractions={1}
                        />
                    </Card>
                </ScrollView>
                <Button
                    title="평가 완료"
                    buttonStyle={{backgroundColor: global.pointColor}}
                    titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                    onPress={this.onPressSubmit}/>
            </View>
        );
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
    }
});