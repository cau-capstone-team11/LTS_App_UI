import React, {Component} from 'react';
import { View } from 'react-native';

import {HeaderInfo} from '../Component/HeaderInfo'
import {SelectStatus} from '../Component/SelectStatus'
import {SelectMenu} from '../Component/SelectMenu';

export default class SelectTypeScreen extends Component {
    render() {
		const list = [
			{
				name: '예약',
				bgColor: "#00f"
			},
			{
				name: '매칭',
				bgColor: "#0f0"
			}
		]
		
		const statusList = ['유형', '종목', '장소', '시간'];
		const step = 0;
		return (
			<View style={{flex: 1}}>
				<HeaderInfo headerTitle="예약 유형 선택" navigation={this.props.navigation}></HeaderInfo>
                <SelectStatus statusList={statusList}></SelectStatus>
				<SelectMenu 
					menuList={list}
					nextPage="SelectSports"
					navigation={this.props.navigation}
					statusList={statusList}
					step={step}/>
			</View>  
		);
    }
}