import React, { Component } from 'react';
import { Text , View , TouchableOpacity ,FlatList, TextInput, StyleSheet, KeyboardAvoidingView , Alert,Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import  * as  firebase from "firebase";
import db from "../config"
import MyHeader from '../components/MyHeader';

export default class BookDonateScreen extends Component{
    constructor(){
        super()
        this.state={
            userId  : firebase.auth().currentUser.email,
            requestedBooksList:[],
        }
        this.requestRef=null
    }

    getRequestedBooksList=()=>{
        this.requestRef=db.collection("requestedBooks")
        .onSnapshot((snapshot)=>{
            var requestedBooksList=snapshot.docs.map(document=>document.data())
            this.setState({
                requestedBooksList:requestedBooksList
            })
        })
    }

    

    componentDidMount(){
        this.getRequestedBooksList()
    }
    
    componentWillUnmount(){
        this.requestRef()
    }

    keyExtractor=(item,index)=>index.toString()

    renderItem=({item,i})=>{
        return(
            <ListItem 
                key={i}
                title={item.bookName}
                subtitle={item.reasonToRequest}
                titleStyle={{color:"black",fontWeight:"bold"}}
                rightElement={
                    <TouchableOpacity 
                        style={styles.button}
                        onPress ={()=>{
                            this.props.navigation.navigate("RecieverDetails",{"details": item})
                        }}
                    >
                        <Text style={{color:"black"}}>
                            VIEW
                        </Text>
                    </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }

    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="DONATE BOOKS" navigation ={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                        this.state.requestedBooksList.length===0
                        ?(
                        <View style={styles.subContainer}>
                            <Text style={{color:"black",fontSize:20}}>
                                NOTHING PENDING
                            </Text>
                        </View>
                        )
                        :(
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.requestedBooksList}
                                renderItem={this.renderItem()}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    }
  })