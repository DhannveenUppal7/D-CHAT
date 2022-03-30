import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button, Input } from 'react-native-elements';
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';

const CreateContactScreen = ({ navigation }) => {

    const [chatEmail, setChatEmail] = useState("")


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "D-CHAT"
        })
    }, [navigation]);

    const createContact = async () => {

        var usersInChat = [];
        usersInChat.push(auth.currentUser.email);
        usersInChat.push(chatEmail.toLocaleLowerCase());
        usersInChat.sort();
        console.log(usersInChat);
        var usersInChatID = ""
        for(var i = 0; i < 2; i++){
            usersInChatID = usersInChatID + " " + String(usersInChat[i])
        }
        const ref = await db.collection("chats").doc(usersInChatID);
        
        var welcomeMessage =  "Now these Contacts can chat " + String(auth.currentUser.email) + " and " + chatEmail.toLocaleLowerCase()

        await ref.set({
            message:welcomeMessage,
            user1: auth.currentUser.email,
            user2: chatEmail.toLocaleLowerCase()
        })
        navigation.goBack();
    }

    return (
        <View style={{ flex:1 , backgroundColor: '#FFFFFF'}}>
            <View style={styles.container}>
                <Input placeholder="Add Contact" type="email" value={chatEmail} onChangeText={(text) => setChatEmail(text)} keyboardType="email-address" style={{height: 50}}  />
                <Button disabled={!chatEmail} containerStyle={styles.button} onPress={createContact} type="outline" title="Create Contact"></Button>

            </View>
        </View>
    )
}

export default CreateContactScreen

const styles = StyleSheet.create({
    container: {
        margin: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        width: 200
    }
})
