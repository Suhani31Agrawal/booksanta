import React, { Component } from 'react';
import { Text , View , TouchableOpacity ,FlatList, TextInput, StyleSheet, KeyboardAvoidingView , Alert,Image } from 'react-native';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from "../config";
import MyHeader from '../components/MyHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { dodgerblue } from 'color-name';
import MyHeader from '../components/MyHeader';

export default class RecieverDetailsScreen extends Component{
  constructor(props){
      super(props)
      this.state={
          userId:firebase.auth().currentUser.email,
          recieverId:this.props.navigation.getParam("details")["userId"],
          requestId:this.props.navigation.getParam("details")["requestId"],
          bookName:this.props.navigation.getParam("details")["bookName"],
          reasonToRequest:this.props.navigation.getParam("details")["reasonToRequest"],
          recieverName:"",
          recieverContact:"",
          recieverAddress:"",
          recieverRequestDocId:""
      }
  }

  getRecieverDetail=()=>{
      db.collection("users").where("emaild","==",this.state.recieverId).get()
      .then(snapshot=>{
          snapshot.forEach(doc=>{
              this.setState({
                  recieverName:doc.data().firstName,
                  recieverContact:doc.data().phoneNumber,
                  recieverAddress:doc.data().address
              })
          })
      })
      db.collection("users").where("requestId" ,"==",this.state.requestId).get()
      .then(snapshot=>{
          snapshot.forEach(doc=>{
              this.setState({
                  recieverRequestDocId:doc.id
              })
          })
      })
  }

  getUserDetails=(userId)=>{
    db.collection("users").where('emailId','==', userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          userName  :doc.data().firstName + " " + doc.data().lastName
        })
      })
    })
  }

  updateBookStatus=()=>{
      db.collection("allDonations").add({
          bookName:this.state.bookName,
          requestId:this.state.requestId,
          requestedBy:this.state.recieverName,
          donorId:this.state.userId,
          requestStatus:"DONOR ACCEPTED YOUR REQUEST"
      })
  }

  addNotification=()=>{
      var message=this.state.userName+" HAS SHOWN INTEREST IN DONATING THE BOOK TO YOU"
      db.collection("allNotifications").add({
      "targeted_user_id" : this.state.recieverId,
      "donor_id" : this.state.userId,
      "request_id" : this.state.requestId,
      "book_name" : this.state.bookName,
      "date" : firebase.firestore.FieldValue.serverTimestamp(),
      "notification_status" : "unread",
      "message" : message
      })
  }

  componentDidMount(){
      this.getRecieverDetail()
      this.getUserDetails(this.state.userId)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Donate Books", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#eaf8fe"
          />
        </View>
        <View style={{flex:0.3}}>
          <Card
              title={"Book Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.reasonToRequest}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBookStatus()
                    this.addNotification()
                    this.props.navigation.navigate('MyDonations')
                  }}>
                <Text>I want to Donate</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }  
});