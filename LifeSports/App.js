import React from "react";
import { View } from "react-native";
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";

import SelectTypeScreen from "./app/Screen/SelectTypeScreen"
import SelectSportsScreen from "./app/Screen/SelectSportsScreen"
import SelectRegionScreen from "./app/Screen/SelectRegionScreen"
import SelectPlanScreen from "./app/Screen/SelectPlanScreen"
import ReservationCheckScreen from "./app/Screen/ReservationCheckScreen"
import JoinPlayerListScreen from "./app/Screen/JoinPlayerListScreen"
import JoinPlayerDetailScreen from "./app/Screen/JoinPlayerDetailScreen"
import FavoriteGymListScreen from "./app/Screen/FavoriteGymListScreen"
import LoginScreen from "./app/Screen/LoginScreen"
import RegisterScreen from "./app/Screen/RegisterScreen"
import RegisterScreen2 from "./app/Screen/RegisterScreen2"
import ReservationStatusScreen from "./app/Screen/ReservationStatusScreen"
import MatchingStatusScreen from "./app/Screen/MatchingStatusScreen"
import MyPageScreen from "./app/Screen/MyPageScreen"
import MainIndividualScreen from './app/Screen/MainIndividualScreen';
import MainMyTeamScreen from './app/Screen/MainMyTeamScreen';
import MainTeamRecommendScreen from './app/Screen/MainTeamRecommendScreen';
import TeamInfoScreen from './app/Screen/TeamInfoScreen';
import TeamGameResultScreen from './app/Screen/TeamGameResultScreen';
import TeamMemberListScreen from './app/Screen/TeamMemberListScreen';
import TeamMemberDetailScreen from './app/Screen/TeamMemberDetailScreen';
import RegisterTeamScreen from './app/Screen/RegisterTeamScreen';
import RatingGameScreen from './app/Screen/RatingGameScreen';
import RegisterGameResultScreen from './app/Screen/RegisterGameResultScreen'
import DivideTeamScreen from './app/Screen/DivideTeamScreen'

global.backgroundColor = "#EDF0F2"		// 배경
global.backgroundColor2 = "#D2DBE0"		// 진한 배경
global.backgroundColor3 = "#232F34"		// Primary 800
global.backgroundColor4 = "#4A6572"		// Primary 600
global.pointColor = "#F9AA33";
global.themeColor = "#344955";
global.fontPointColor = "#000";

global.appServerIp = '3.15.50.24:80';
global.loginStatus = false;
global.hasTeam = 0;
global.UDID = '';
global.ID = '';
global.name = '';
global.MMR = '';
global.gender = '';
global.refresh = false;

export const StackNavigator = createStackNavigator({
	Home: {
		screen: createBottomTabNavigator({
			Individual: MainIndividualScreen,
			Team: MainMyTeamScreen,
			TeamRecommend: MainTeamRecommendScreen
		},{
			tabBarOptions: {
				activeTintColor: global.themeColor,
				labelStyle: {
					fontSize: 12,
				}
			}
		}),
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	SelectType: {
		screen : SelectTypeScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	SelectSports: {
		screen : SelectSportsScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	SelectRegion: {
		screen : SelectRegionScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	SelectPlan: {
		screen : SelectPlanScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	ReservationCheck: {
		screen : ReservationCheckScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	JoinPlayerList: {
		screen : JoinPlayerListScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	JoinPlayerDetail: {
		screen : JoinPlayerDetailScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	FavoriteGymList: {
		screen : FavoriteGymListScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	Login: {
		screen : LoginScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	Register: {
		screen : RegisterScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	Register2: {
		screen : RegisterScreen2,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	ReservationStatus: {
		screen : ReservationStatusScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	MatchingStatus: {
		screen : MatchingStatusScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	MyPage: {
		screen : MyPageScreen,
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	TeamInfo: {
		screen: createBottomTabNavigator({
			TeamInfo: TeamInfoScreen,
			GameResult: TeamGameResultScreen,
			MemberList: TeamMemberListScreen
		},
		{
			tabBarOptions: {
				activeTintColor: global.themeColor,
				labelStyle: {
					fontSize: 12,
				}
			}
		}),
		navigationOptions: ({ navigation }) => ({ header: null })
	},
	TeamMemberDetail: {
		screen : TeamMemberDetailScreen,
		navigationOptions: ({ navigation }) => ({ header: null })	
	},
	RegisterTeam: {
		screen : RegisterTeamScreen,
		navigationOptions: ({ navigation }) => ({ header: null })	
	},
	RatingGame: {
		screen : RatingGameScreen,
		navigationOptions: ({ navigation }) => ({ header: null })	
	},
	RegisterGameResult: {
		screen : RegisterGameResultScreen,
		navigationOptions: ({ navigation }) => ({ header: null })	
	},
	DivideTeam: {
		screen : DivideTeamScreen,
		navigationOptions: ({ navigation }) => ({ header: null })	
	},
}, {
	initialRouteName: 'Home',
});

export default createAppContainer(StackNavigator);