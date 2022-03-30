import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Pressable, TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View, ScrollView, Modal } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomListItem from '../components/CustomListItem'
import { auth, db } from '../firebase'
import { AntDesign } from '@expo/vector-icons';




const HomeScreen = ({ navigation }) => {

    const [chattingUsers, setChattingUsers] = useState([]);
    const [message, setMessage] = useState("");

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace("Sign In");

        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "D-CHAT",
            headerRight: () => {
                // <Text>Hi</Text>
                return (<View style={{ marginRight: 20, display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Create Contact")} activeOpacity="0.5" style={{ marginTop: 4 }}>
                        <AntDesign style={{ fontSize: 25, color: "white", fontWeight: "bolder" }} name="pluscircle"></AntDesign>
                    </TouchableOpacity>
                    <View style={{ width: 30 }}></View>
                    <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} imageProps={{ resizeMode: 'stretch' }} onPress={() => {
                        navigation.navigate("Profile")
                    }} />



                </View>)
            },
            headerLeft: () => {
                return (<View style={{ marginLeft: 20 }}>
                    <TouchableOpacity onPress={signOutUser} activeOpacity="0.5">
                        <AntDesign name="logout" style={{ color: "white", fontSize: 25 }}></AntDesign>
                    </TouchableOpacity>
                </View>)
            },

        })
    }, [navigation])






    useEffect(() => {


        db.collection('chats').onSnapshot((snapshot)=>setChattingUsers(
            snapshot.docs.map((doc) => {
                if(doc.data().user1 == auth?.currentUser?.email){
                    return { chattingPerson: doc.data().user2, nameOFDOC: doc.id }
                }
                if (doc.data().user2 == auth?.currentUser?.email) {
                    return { chattingPerson: doc.data().user1, nameOFDOC: doc.id } ;
                }
            })
        ))
    }, [])




    const openChat = (chattingPerson, dpUrl, docName, userName) => {
        navigation.navigate("Chat", {
            chattingPerson: chattingPerson,
            dpUrl: dpUrl,
            docName: docName,
            userName
        });
    }



    return (

        <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
            <ScrollView style={styles.container}>
                {chattingUsers.map((data) => {
                    return (
                        data?<CustomListItem key={data?.nameOFDOC} chattingTo={data} openChat={openChat} />:<View />
                    )
                })}

            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }
})
