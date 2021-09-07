import React from 'react';
import {createDrawerNavigator} from "react-navigation-drawer";
import {BottomTabNavigator} from "./BottomTabNavigator"
import {CustomSideBarMenu} from "./CustomSideBarMenu"
import {NotificationScreen} from "../screens/NotificationScreen";
import {BookDonateScreen} from "../screens/BookDonateScreen"
import {BookRequestScreen} from "../screens/BookRequestScreen"
import {SettingScreen} from "../screens/SettingScreen"

export const AppDrawerNavigator=createDrawerNavigator({
    Home : {
        screen : BottomTabNavigator
        },
      MyDonations : {
        screen :BookDonateScreen
      },
      Notification : {
        screen : NotificationScreen
      },
      Setting : {
        screen : SettingScreen
      }
    },
      {
        contentComponent:CustomSideBarMenu
      },
      {
        initialRouteName : 'Home'
 })