import React, { Component } from 'react';
import { Text , View , TouchableOpacity ,FlatList, TextInput, StyleSheet, KeyboardAvoidingView , Alert,Image } from 'react-native';
import {DrawerItems} from "react-navigation-drawer"

import firebase from 'firebase';

export default class CustomSideBarMenu extends Component{
    render(){
      return(
          <View style={styles.container}>
             <View style={styles.drawerItemConatiner}>
                 <DrawerItems {...this.props}/>
             </View>
             <View style={styles.logoutContainer}>
                 <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={()=>{
                        this.props.navigation.navigate("WelcomeScreen")
                        firebase.auth().signout()
                    }}
                 >
                     <Text style={styles.logoutText}>
                         LOG OUT
                     </Text>
                 </TouchableOpacity>
             </View>
          </View>
      )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    drawerItemConatiner:{
        flex:0.8
    },
    logoutContainer:{
        flex:0.2,
        justifyContent:"flex-end",
        paddingBottom:28
    },
    logoutButton:{
        height:35,
        width:"100%",
        justifyContent:"center",
        padding:15
    },
    logoutText:{
        fontSize:25,
        fontWeight:"bold"
    }
})