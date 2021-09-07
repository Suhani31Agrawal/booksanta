import React, { Component } from 'react';
import { Text , View , TouchableOpacity , TextInput, StyleSheet, KeyboardAvoidingView , Alert,Image } from 'react-native';
import  * as  firebase from "firebase";
import db from "../config"
import MyHeader from '../components/MyHeader';

export default class BookRequestScreen extends Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email(),
            bookName:"",
            reasonToRequest:"",
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    addReqeust=(bookName,reasonToRequest)=>{
        var userId=this.state.userId
        var randomRequestId=this.createUniqueId()
        db.collection("requestedBooks").add({
            "userId":userId,
            "bookName":bookName,
            "reasonToRequest":reasonToRequest,
            "requestId":randomRequestId
        })
        this.setState({
            bookName:"",
            reasonToRequest:""
        })
        return Alert.alert("BOOK REQUESTED SUCCESSFULLY")
    }

    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="REQUEST BOOKS" navigation ={this.props.navigation}/>
                <KeyboardAvoidingView style={styles.keyBoardStyle}>
                    <TextInput 
                        style={styles.formTextInput}
                        placeholder={"Enter Book Name"}
                        onChangeText={(text)=>{
                            this.setState({
                                bookName:text
                            })
                        }}
                        value={this.state.bookName}
                    />
                    <TextInput 
                        style ={[styles.formTextInput,{height:300}]}
                        multiline
                        placeholder={"REASON FOR REQUESTING THE BOOK"}
                        numberOfLines={8}
                        onChangeText={(text)=>{
                            this.setState({
                                reasonToRequest:text
                            })
                        }}
                        value ={this.state.reasonToRequest}
                    />
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={()=>{
                        this.addReqeust(this.state.bookName,this.state.reasonToRequest)
                    }}>
                        <Text>
                            SUBMIT
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)