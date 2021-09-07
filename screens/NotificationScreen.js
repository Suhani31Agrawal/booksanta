import React, { Component } from 'react';
import { Text , View , FlatList, StyleSheet } from 'react-native';
import { ListItem , Icon} from 'react-native-elements';
import firebase from "firebase";
import db from "../config"
import MyHeader from '../components/MyHeader';

export default class NotificationScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        }
        this.notificationRef=null
    }

    getNotification=()=>{
        this.requestRef=db.collection("allNotifications")
        .where("notification_status","==","unread")
        .where("targeted_user-id","==",this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications=[]
            snapshot.docs.map((doc)=>{
                var notification=doc.data()
                notification["doc_id"]=doc.doc_id
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications:allNotifications
            })
        })
    }
    componentDidMount(){
        this.getNotification()
    }

    componentWillUnmount(){
        this.notificationRef()
    }
     
    keyExtractor=(item,index)=>index.toString()

    renderItem=({item,index})=>{
        return(
           <ListItem 
                key={index}
                leftElement={<Icon name="book" type="font-awesome" color="blue"/>}
                title={item,bookName}
                titleStyle={{color:"black" ,fontWeight:"bold"}}
                subTitle={item.message}
                bottomDivider
           />
        )
    }

    render(){
        return(
            <View style={Styles.container}>
                <View style={{flex:0}}>
                    <MyHeader title={"NOTIFICATION"} navigation={this.props.navigation}/>
                </View>
                <View style={{flex:0.7}}>
                    {
                        this.state.allNotifications.length===0
                        ?(
                            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:22}}>
                                    YOU DON'T HAVE ANY NOTIFICATIONS
                                </Text>
                            </View>
                        )
                        :(
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.allNotifications}
                                renderItem={this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
})