import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Card } from 'react-native-elements'

export class ImageCard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        return(
            <View>
                <TouchableOpacity onPress={this.props.onPressBtn}>
                    <Card
                        title={this.props.title}
                        image={this.props.imagePath}
                        imageStyle={{height: 120}}
                        containerStyle={this.props.twoSide ? ( this.props.right ? {marginLeft: 5} : {marginRight: 5}) : ({})}
                        >
                        <Text style={{marginBottom: 10, color: "#000"}}>
                            {this.props.detail}
                        </Text>
                        <Button
                            buttonStyle={{backgroundColor: global.pointColor}}
                            titleStyle={{color: "#000", fontWeight: 'bold', fontSize: 14}}
                            title={this.props.btnTitle}
                            onPress={this.props.onPressBtn}/>
                    </Card>
                </TouchableOpacity>
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

