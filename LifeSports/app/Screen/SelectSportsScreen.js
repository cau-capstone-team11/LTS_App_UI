import React, {Component} from 'react';
import { View } from 'react-native';

import {HeaderInfo} from '../Component/HeaderInfo'
import {SelectStatus} from '../Component/SelectStatus'
import {SelectMenu} from '../Component/SelectMenu';

export default class SelectSportsScreen extends Component {
    render() {
		const list = [
			{
				name: '축구',
				bgColor: "#00f"
			},
			{
				name: '농구',
				bgColor: "#0f0"
            },
            {
				name: '야구',
				bgColor: "#ff0"
            },
            {
				name: '배드민턴',
				bgColor: "#0ff"
			}
        ]
        
        const statusList = this.props.navigation.getParam("statusList");
        const step = this.props.navigation.getParam("step");
		
		return (  
			<View style={{flex: 1}}>
				<HeaderInfo headerTitle="종목 선택" navigation={this.props.navigation}></HeaderInfo>
                <SelectStatus statusList={statusList}></SelectStatus>
				<SelectMenu 
					menuList={list}
					nextPage="SelectRegion"
					navigation={this.props.navigation}
                    statusList={statusList}
                    step={step}/>
			</View>  
		);
	}
}