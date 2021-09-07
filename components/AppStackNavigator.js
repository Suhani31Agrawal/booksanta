import React from 'react';
import {createStackNavigator} from "react-navigation-stack";

import BookDonateScreen from '../screens/BookDonateScreen';
import ReciverDetailsScreen from '../screens/RecieverDetailsScreen'
  
export const AppStackNavigator=createStackNavigator({
    BookDonate:{
        screen:BookDonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    ReciverDetails:{
        screen:ReciverDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
    }
},
{
    intiateRouteName:"BookDonate"
})
