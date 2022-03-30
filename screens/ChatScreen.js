import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, FlatList, ActivityIndicator } from 'react-native'
import { Avatar, Button, Icon } from 'react-native-elements'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Keyboard } from 'react-native';
import { db, auth, storage } from '../firebase';
import firebase from 'firebase/app';
import { useFocusEffect } from '@react-navigation/core';
import * as ImagePicker from "expo-image-picker";



const ChatScreen = ({ navigation, route }) => {

    const [message, setMessage] = useState("");
    const [msgSt, setMsgSt] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageBlob, setImageBlob] = useState(null);
    const scrollViewRef = useRef();


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "D-CHAT",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => {
                return (<View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar rounded source={{ uri: route.params.dpUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" }} imageProps={{ resizeMode: 'stretch' }} ></Avatar>
                    <Text style={{ color: "white", marginLeft: 5, fontWeight: "900", fontSize: 20 }}>{route.params.userName}</Text>
                </View>)
            }
        })
    }, [navigation]);

    useFocusEffect(async () => {
        if (Platform.OS !== "web") {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                alert("Permission Denied!");
            }

        }
    });


    const uriToBlob = (uri) => {

        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();

            xhr.onload = function () {
                // return the blob
                resolve(xhr.response);
            };

            xhr.onerror = function () {
                // something went wrong
                reject(new Error('uriToBlob failed'));
            };

            // this helps us get a blob
            xhr.responseType = 'blob';

            xhr.open('GET', uri, true);
            xhr.send(null);

        });

    }

    const uploadToFirebase = (blob, nameOfImage) => {

        return new Promise((resolve, reject) => {

            var storageRef = storage.ref();


            storageRef.child(`chats/${nameOfImage}.jpg`).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {


                resolve(snapshot);

            }).catch((error) => {

                reject(error);

            });

        });


    }


    const sendMessagePicture = async () => {
        Keyboard.dismiss();
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1

        }).then((result) => {

            if (!result.cancelled) {
                // User picked an image
                const { height, width, type, uri, base64 } = result;

                return uriToBlob(uri);

            }

        }).then(async (blob) => {


            var imgUrl;


            if (blob != null) {

                await db.collection("chats").doc(route.params.docName).collection("messages").add({
                    msgType: "none",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    sentByEmail: auth.currentUser.email
                }).then(async (response) => {

                    var fileName = response.id;
                    await uploadToFirebase(blob, String(fileName)).then(async () => {

                        imgUrl = await storage.ref().child(`chats/${String(fileName)}.jpg`).getDownloadURL();



                        await db.collection("chats").doc(route.params.docName).collection("messages").doc(fileName).set({
                            msgType: "picture",
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            imageLink: imgUrl,
                            sentByEmail: auth.currentUser.email,
                        });


                    });
                });


            }
        })
    }

    const sendMessage = async () => {
        Keyboard.dismiss();

        setMessage("");

        var timestampTaken = firebase.firestore.FieldValue.serverTimestamp();

        await db.collection("chats").doc(route.params.docName).collection("messages").add({
            msgType: "text",
            timestamp: timestampTaken,
            message: message,
            sentByEmail: auth.currentUser.email,
        });



    }




    useEffect(() => {
        const dataRec = db.collection("chats").doc(route.params.docName).collection("messages").orderBy("timestamp").onSnapshot((snapshot) => setMsgSt(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }))
        ))
        return dataRec;
    }, [route]);


    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const onKeyboardShow = event => setKeyboardOffset(event.endCoordinates.height);
    const onKeyboardHide = () => setKeyboardOffset(0);
    const keyboardDidShowListener = useRef();
    const keyboardDidHideListener = useRef();

    useEffect(() => {
        keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
        keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);

        return () => {
            keyboardDidShowListener.current.remove();
            keyboardDidHideListener.current.remove();
        };
    }, []);

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "white", backgroundColor: "#FFFFFF" }} >
            <>


                <ScrollView contentContainerStyle={{ paddingTop: 15 }} ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({ animated: true })} >
                    {msgSt.map(({ id, data }) => {
                        if (data.msgType == "text") {
                            if (data.sentByEmail == auth.currentUser.email) {
                                return (
                                    <View key={id} style={styles.sender} >
                                        <Text style={{ color: "white", fontWeight: '900', fontSize: 16 }}>{data.message}</Text>
                                        <Text style={{ color: "white", fontWeight: '500', fontSize: 13, marginTop: 5 }}>{data?.timestamp?.toDate()?.toString()}</Text>

                                    </View>
                                )
                            }
                            else {
                                return (
                                    <View key={id} style={styles.reciever} >
                                        <Text style={{ color: "black", fontWeight: '900', fontSize: 16 }}>{data.message}</Text>
                                        <Text style={{ color: "black", fontWeight: '500', fontSize: 13, marginTop: 5 }}>{data?.timestamp?.toDate()?.toString()}</Text>

                                    </View>
                                )
                            }
                        }
                        else {
                            if (data.sentByEmail == auth.currentUser.email) {
                                return (
                                    <View key={id} style={styles.sender} >

                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("ImageView", {
                                                imageSource: data.imageLink
                                            })
                                        }} activeOpacity={0.7}>
                                            <Image source={{ uri: data.imageLink }} style={{ width: "100%", height: 200 }} resizeMode="contain"></Image>

                                        </TouchableOpacity>
                                        <Text style={{ color: "white", fontWeight: '500', fontSize: 13, marginTop: 5 }}>{data?.timestamp?.toDate()?.toString()}</Text>

                                    </View>
                                )
                            }
                            else {
                                return (
                                    <View key={id} style={styles.reciever} >
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("ImageView", {
                                                imageSource: data.imageLink
                                            })
                                        }} activeOpacity={0.7}>
                                            <Image source={{ uri: data.imageLink }} style={{ width: "100%", height: 200 }} resizeMode="contain"></Image>

                                        </TouchableOpacity>
                                        <Text style={{ color: "black", fontWeight: '500', fontSize: 13, marginTop: 5 }}>{data?.timestamp?.toDate()?.toString()}</Text>

                                    </View>
                                )
                            }
                        }
                    })}
                </ScrollView>
                <View style={styles.footer}>
                    <View style={{ height: 30 }} ></View>
                    <TextInput value={message} onChangeText={text => setMessage(text)} placeholder="Enter a message" style={{
                        bottom: keyboardOffset,
                        height: 50,
                        flex: 1,
                        marginRight: 15,
                        backgroundColor: "#e0dcdc",
                        padding: 10,
                        color: "black",
                        borderRadius: 30,
                        overflow: "hidden",
                    }} multiline={true} />
                    <Button onPress={message != "" ? sendMessage : () => { }} class={styles.sendContainer} type="clear" color="white" icon={<Icon name="send" style={message == "" ? { opacity: 0.34 } : { opacity: 1 }} size={25} color="red"></Icon>}></Button>
                    <Button onPress={sendMessagePicture} class={styles.sendContainer} type="clear" color="white" icon={<Icon name="image" size={25} color="red"></Icon>}></Button>

                </View>
            </>
        </SafeAreaView>

    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    reciever: {
        padding: 15,
        backgroundColor: "#e0dcdc",
        alignSelf: "flex-start",
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: 300,
        position: "relative",
        justifyContent: "center"
    },
    sender: {
        padding: 15,
        backgroundColor: "#2dacbd",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: 300,
        position: "relative",
        justifyContent: "center"
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    }
})
