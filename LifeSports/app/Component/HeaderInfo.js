import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Header, Avatar, Icon } from 'react-native-elements'

export class HeaderInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isMain: 'flex',
            nextPage: ''
        }
    }

    componentDidMount(){
        if(this.props.headerTitle == "메인" || this.props.type == "Team"){
            this.setState({isMain: 'none'});
        }
        else{
            this.setState({isMain: 'flex'});
        }
    }

    nextPage = () => {
        if(!global.loginStatus)
            this.props.navigation.navigate("Login");
        else{
            player = {
                UDID: global.UDID,
                ID: global.ID,
                name: global.name,
                gender: global.gender,
                MMR: global.MMR
            };
            this.props.navigation.navigate("MyPage", {"player": player});
        }
    }

    render(){
        return(
            <View>
                <Header
                    containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : 0}}
                    innerContainerStyles={{flexDirection: 'row'}}
                    backgroundColor= {global.themeColor}
                    leftComponent={<Icon
                                        name="user-circle"
                                        type='font-awesome'
                                        size={30}
                                        color='white'
                                        containerStyle={{marginLeft: 10}}
                                        underlayColor={global.themeColor}
                                        onPress={this.nextPage}
                                    />}
                    centerComponent={ <View style={{alignItems: 'center'}}>
                                        <Text style={styles.title}>{this.props.headerTitle}</Text>
                                        </View>}
                    rightComponent={<Icon name='ios-arrow-round-back' 
                                        size={40} 
                                        type='ionicon' 
                                        color={'#fff'} 
                                        iconStyle={{marginRight: 10}}
                                        underlayColor={global.themeColor}
                                        onPress={() => {
                                            if(this.props.pop)
                                                this.props.navigation.pop()
                                            else
                                                this.props.navigation.goBack()
                                        }}
                                        
                                        containerStyle={{display: this.state.isMain}}/>}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    title: {
        justifyContent: 'center',
        color: '#fff',
        alignContent:'center',
        textAlignVertical: 'center',
        fontSize: 20
    }
});

