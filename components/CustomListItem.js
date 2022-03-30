import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../firebase';


const CustomListItem = ({ chattingTo, openChat }) => {

    const [dpUrl, setDpUrl] = useState("");
    const [userName, setUserName] = useState("");
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState("");


    useEffect(() => {   
        db.collection("users").get().then((snapshot)=>{
            snapshot.forEach(doc => {
                if (doc && doc.exists) {
                    // console.log(String(doc.id) == String(chattingTo));
                    if (doc.id == chattingTo.chattingPerson) {
                        // console.log("Doc Data", doc.data());
                        setDpUrl(doc.data().dpUrl);
                        setUserName(doc.data().username);
                    }
                }
            });
        })
    }, [])


    useEffect(() => {
        const dataRec = db.collection("chats").doc(chattingTo.nameOFDOC).collection("messages").where("msgType", "==", "text").orderBy("timestamp").onSnapshot((snapshot) => setMessages(
            snapshot.docs.map((doc) => doc.data())
        ))
        // messages.sort();
        return dataRec;

    }, []);

    

    return (

        <ListItem onPress={() => openChat(chattingTo.chattingPerson, dpUrl ? dpUrl : "https://i1.sndcdn.com/avatars-000437232558-yuo0mv-t500x500.jpg", chattingTo.nameOFDOC, userName)} bottomDivider>
            <Avatar rounded source={{ uri: dpUrl ? dpUrl : "https://i1.sndcdn.com/avatars-000437232558-yuo0mv-t500x500.jpg" }} imageProps={{resizeMode: 'stretch'}} ></Avatar>
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>{userName || chattingTo.chattingPerson || " "}</ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">{messages?.[messages.length - 1]?.message}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>

    )
}

export default CustomListItem

const styles = StyleSheet.create({})
