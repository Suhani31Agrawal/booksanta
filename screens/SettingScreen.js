import React, { Component } from 'react';
import { Text , View , TouchableOpacity , TextInput, StyleSheet, KeyboardAvoidingView , Alert,Image } from 'react-native';
import  * as  firebase from "firebase";
import db from "../config"
import MyHeader from '../components/MyHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default class SettingScreen extends Component{
    constructor(){
        super()
        this.state={
            email:firebase.auth().currentUser.email(),
            firstName:"",
            lastName:"",
            address:'',
            contact:'',
            docId:''
        }
    }

    getUserDetails=()=>{
      var {email}=this.state
      db.collection("users").where("emailId","==",email).get()
      .then(snapshot=>{
          snapshot.forEach(doc=>{
              var data=doc.data()
              this.setState({
                  email : data.emailId,
                  firstName : data.firstName,
                  lastName : data.lastName,
                  address : data.address,
                  contact : data.contact,
                  docId : doc.id
              })
          })
      })  
    }

    updateUserDetails=()=>{
        var {docId}=this.state
        if(docId){
            db.collection("users").doc(docId)
            .update({
                firstName:data.firstName,
                lastName:data.lastName,
                address:data.address,
                contact:data.contact,
            }).then(()=>{
                Alert.alert("PROFILE UPDATED SUCCESSFULLY")
            })
        }
        else{
            Alert.alert("WRONG DOCUMENT ID ")
        }
    }

    componentDidMount(){
        this.getUserDetails()
    }

    render(){
        var{firstName,lastName,address,contact}=this.state
       return(
           <View style={styles.container}>
              <MyHeader title="SETTINGS" navigation={this.props.navigation}/>
              <View style={styles.upperContainer}>
                  <CustomInput 
                    style={styles.input}
                    placeHolder={"First Name"}
                    maxLength={10}
                    onChangeText={(text)=>{
                        this.setState({
                            firstName:text
                        })
                    }}
                    value={firstName}
                  />
                  <CustomInput 
                    style={styles.input}
                    placeHolder={"Last Name"}
                    maxLength={10}
                    onChangeText={(text)=>{
                        this.setState({
                            lastName:text
                        })
                    }}
                    value={lastName}
                  />
                  <CustomInput 
                    style={styles.input}
                    placeHolder={"Contact"}
                    maxLength={10}
                    KeyboardType={"numeric"}
                    onChangeText={(text)=>{
                        this.setState({
                            contact:text
                        })
                    }}
                    value={contact}
                  />
                  <CustomInput 
                    style={styles.input}
                    placeHolder={"Address"}
                    multiLine={true}
                    onChangeText={(text)=>{
                        this.setState({
                            address:text
                        })
                    }}
                    value={address}
                  />
                  <CustomButton
                     style={styles.button}
                     title={"SAVE"}
                     titleStyle={styles.buttonTitle}
                     onPress={()=>{
                         this.updateUserDetails()
                     }}
                  />
              </View>
           </View>
       )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    upperContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center"
    },
    input: {
      width: "75%",
      height: 55,
      borderColor: "#6fc0b8",
      borderWidth: 1.5,
      marginTop: 20
    },
    button: {
      marginTop: 20,
      backgroundColor: "#6fc0b8"
    },
    buttonTitle: {
      color: "#fff"
    }
  });
