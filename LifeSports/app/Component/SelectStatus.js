import React from "react";
import { View, Text, StyleSheet } from "react-native";


export class SelectStatus extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        const statusList = this.props.statusList;
        const styleList = [];        
        
        for(i = 0; i < 4; i++){
            if(statusList[i] == '유형' || statusList[i] == '종목' || statusList[i] == '장소' || statusList[i] == '시간')
                styleList[i] = styles.statusItem;
            else
                styleList[i] = [styles.statusItemSelected, {color: global.pointColor}];
        }

        return(
            <View style={[styles.statusView, {backgroundColor: global.themeColor}]}>
                <Text style={styleList[0]} numberOfLines={1}>{statusList[0]}</Text>
                <Text style={styleList[1]} numberOfLines={1}>{statusList[1]}</Text>
                <Text style={styleList[2]} numberOfLines={1}>{statusList[2]}</Text>
                <Text style={styleList[3]} numberOfLines={1}>{statusList[3]}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    statusView: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        marginTop: -1
    },
    statusItem: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: "#fff",
        fontSize: 15
    },
    statusItemSelected: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: "#00f",
        fontSize: 15
    }
});