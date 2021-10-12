import React, { Component } from 'react';
import { Text , View , TouchableOpacity , TextInput, StyleSheet, KeyboardAvoidingView ,TouchableHighlight, Alert,Image } from 'react-native';
import  * as  firebase from "firebase";
import db from "../config"
import MyHeader from '../components/MyHeader';
import CustomButton from '../components/CustomButton'
import {BookSearch} from "react-native-google-books"
import { TouchableHighlight } from 'react-native-gesture-handler';

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

    handleBookRequest=async(bookName,reasonToRequest)=>{
        var {userId}=this.state
        var randomRequestId=this.createUniqueId()
        if(bookName && reasonToRequest){
            db.collection("requestedBooks").add({
                userId:userId,
                bookName:bookName,
                reasonToRequest:reasonToRequest,
                requestId:randomRequestId,
                bookStatus:"requested",
                date:firebase.firestore.FieldValue.serverTimestamp()
            })
            await this.getRequestedBooks()
            db.collection("users").where("emailId","==",userId)
            .get().then().then(snapshot=>{
                snapshot.forEach(doc=>{
                    db.collection("users").doc(doc.id)
                    .update({
                        isBookRequestActive:true
                    })
                })
            })
            this.setState({
                bookName:"",
                reasonToRequest:"",
                requestId:randomRequestId
            })
           Alert.alert("BOOK REQUESTED SUCCESFULLY")
        }
        else{
            Alert.alert("FILL THE DETAILS PROPERLY")
        }
    }

    getRequestedBooks=()=>{
        const{userId}=this.state
        db.collection("requestedBooks").where("userId","==",userId).get()
        .then(snapshot=>{
            snapshot.docs.map(doc=>{
                const details=doc.data()
                if(details.bookStatus !== "recieved"){
                    this.setState({
                        bookStatus:details.bookStatus,
                        requestId:details.requestId,
                        requestedBookName:details.bookName,
                        docId:doc.id
                    })
                }
            })
        })
    }

    getActiveBookRequest=()=>{
        const{userId}=this.state
        db.collection("users").where("emailId","==",userId)
        .onSnapshot(snapshot=>{
            snapshot.docs.map(doc=>{
                const details=doc.data()
                this.setState({
                    isBookRequestActive:details.isBookRequestActive,
                    userDocId:doc.id
                })
            })
        })
    }

    addRequest=(bookName,reasonToRequest)=>{
        var userId=this.state.userId
        var randomRequestId=this.createUniqueId()
        var books=await BookSearch.searchbook(bookName,"AIzaSyCllhi-k5wGKoViN8-CB_BSAav6UP2ExKo")
        db.collection("requestedBooks").add({
            "userId":userId,
            "bookName":bookName,
            "reasonToRequest":reasonToRequest,
            "requestId":randomRequestId,
            "bookStatus":"requested",
            "date":firebase.firestore.FieldValue.serverTimestamp(),
            "imagelink":books.data[0].volumeInfo.imageLinks.smallThumbnail
        })
        await this.getActiveBookRequest()
        db.collection("users").where("emailId","==",userId).get().then()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id).update({
                    isBookRequestActive:true
                })
            })
        })
        this.setState({
            bookName:"",
            reasonToRequest:""
        })
        return Alert.alert("BOOK REQUESTED SUCCESSFULLY")
    }

    updateBookRequestStatus=()=>{
        const {userId,docId}=this.state
        db.collection("requestedBooks").doc(docId).update({
            bookStatus:"recieved"
        })
        db.collection("users").where("emailId","==",userId)
        .get().then(snapshot=>{
            snapshot.docs.map(doc=>{
                db.collection("users").doc(doc.id).update({
                    isBookRequestActive:false
                })
            })
        })
    }

    sendNotification=()=>{
        const {userId,requestId}=this.state
        db.collection("users").where("emailId","==",userId)
        .get().then(snapshot=>{
            snapshot.docs.map(doc=>{
                var name=doc.data().firstName
                var lastName=doc.data.lastName

                db.collection("allNotifications").where("requestId","==",requestId).get()
                .then(snapshot=>{
                    snapshot.docs.map(doc=>{
                        const donorId=doc.data().donorId
                        const bookName=doc.data().bookName
                        const message="${name} ${lastName}  HAS RECIEVED THE BOOK ${bookName}"

                        db.collection("allNotifications").add({
                            targetedUserId:donorId,
                            message:message,
                            notificationStatus:"unread",
                            bookName:bookName
                        })
                    })
                })
            })
        })
    }

    recievedBooks=(bookName)=>{
        const {userId,requestId}=this.state
        db.collection("recievedBooks").add({
            userId:userId,
            requestId:requestId,
            bookName:bookName,
            bookStatus:bookStatus
        })
    }

    async getBooksFromApi(bookName){
        this.setState({bookName:bookName})

        if(bookName.length>2){
            var books=await BookSearch.searchbook(bookName,"AIzaSyCllhi-k5wGKoViN8-CB_BSAav6UP2ExKo")
            this.setState({
                dataSource:books.data,
                showFlatlist:true
            })
        }

    }

    renderItem=({item,i})=>{
       let obj={
           title:item.volumeInfo.title,
           selfLink:item.selfLink,
           buyLink:item.saleInfo.buyLink,
           imageLink:item.volumeInfo.imageLinks
       }

       return(
           <TouchableHighlight
              style={{alignItems:"center",
                      backgroundColor:"#dddddd",
                      padding:10,
                      width:"90%"
                    }}
              activeOpacity={0.6}
              underlayColor="#dddddd"
              onPress={()=>{
                  this.setState({
                      showFlatlist:false,
                      bookName:item.volumeInfo.title,
                  })
              }}
              bottomDivider
           >
               <Text>{item.volumeInfo.title}</Text>
           </TouchableHighlight>
       )
    }

    render(){
        if(this.state.isBookRequestActive===true){
        }
        return(
            <View style={{flex:1}}>
                <MyHeader title="REQUEST BOOKS" navigation ={this.props.navigation}/>
                {isBookRequestActive?(
                    <View>
                        <View>
                            <Text>BOOK NAME</Text>
                            <Text>{requestedBookName}</Text>
                        </View>
                        <View>
                            <Text>BOOK STATUS</Text>
                            <Text>{bookStatus}</Text>
                        </View>
                        <CustomButton
                            title={"RECIEVED THE BOOK"}
                            onPress={()=>{
                                const {requestedBookName}=this.state
                                this.recievedBooks(requestedBookName)
                                this.sendNotification()
                                this.updateBookRequestStatus()
                            }}
                        />
                    </View>
                ):(
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
                )}
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