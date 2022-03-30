import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/core';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import { auth, storage, db } from '../firebase'
import * as ImagePicker from "expo-image-picker";



const ProfileScreen = () => {


    const [dpURL, setDpURL] = useState(auth.currentUser.photoURL);



    useFocusEffect(async () => {
        if (Platform.OS !== "web") {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                alert("Permission Not Granted");
            }

        }
    }, []);

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

            storageRef.child(`dpimages/${nameOfImage}.jpg`).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {


                resolve(snapshot);

            }).catch((error) => {

                reject(error);

            });

        });

    }

    const UpdateDP = async () => {

        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            allowsEditing: true
        }).then((result) => {

            if (!result.cancelled) {
                const { height, width, type, uri } = result;

                

                return uriToBlob(uri);

            }

        }).then(async (blob) => {
            var imgUrl;



            if (blob != null) {
                await uploadToFirebase(blob, String(auth.currentUser.email)).then(async () => {
                    imgUrl = await storage.ref().child(`dpimages/${String(auth.currentUser.email)}.jpg`).getDownloadURL();


                    const ref = db.collection("users").doc(auth.currentUser.email);

                    await auth.currentUser.updateProfile({
                        photoURL: imgUrl
                    });

                    
                    await ref.update({
                        dpUrl: imgUrl || "https://firebasestorage.googleapis.com/v0/b/d-chat-da95e.appspot.com/o/dpimages%2FdefaultUser.png?alt=media&token=6b989378-bde1-4d97-8807-ec3a63c2fd08"
                    });
                    
                    await setDpURL(imgUrl);



                    


                });
            }

        });
    
    
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF'}}>
            
            <TouchableOpacity activeOpacity={0.7} onPress={UpdateDP} >
                <Image source={{ uri: dpURL }} style={{ width: 300, height: 300, margin: 30, borderRadius: 40 }} resizeMode="contain" />
            </TouchableOpacity>

            <Text style={{
                fontSize: 20,
                fontWeight: "900",
                fontFamily: "Tahoma",
                margin: 30
            }}>{auth.currentUser.email} | {auth.currentUser.displayName} </Text>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: "900",
        fontFamily: "Tahoma",
        margin: 30
    }
})
