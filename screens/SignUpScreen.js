import { StatusBar } from 'expo-status-bar'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Button, Input, Image } from 'react-native-elements';
import { auth, db, storage } from '../firebase';
import * as ImagePicker from "expo-image-picker";
import Constants from 'expo-constants'
import { useFocusEffect } from '@react-navigation/core';
import { ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native';



const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageBlob, setImageBlob] = useState(null);
    const [indicatorVisible, setIndicatorVisible] = useState(false);
    const [elementsVisible, setElementsVisible] = useState(true);
    const [uriForAvatar, setUriForAvatar] = useState("");



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


    const PickImage = async () => {
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            allowsEditing: true
        }).then((result) => {

            if (!result.cancelled) {
                // User picked an image
                const { height, width, type, uri } = result;
                setUriForAvatar(result.uri)
                return uriToBlob(uri);

            }

        }).then((blob) => {

            setImageBlob(blob);
        })
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to Sign In",

        });
    }, [navigation]);

    const signUp = async () => {

        var imgUrl;


        if (imageBlob == null) {

            setIndicatorVisible(true);
            setElementsVisible(false);

            imgUrl = "https://firebasestorage.googleapis.com/v0/b/d-chat-da95e.appspot.com/o/dpimages%2FdefaultUser.png?alt=media&token=6b989378-bde1-4d97-8807-ec3a63c2fd08";

            var errorLOAD;

            await auth.createUserWithEmailAndPassword(email.toLocaleLowerCase(), password).then(authUser => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imgUrl || "https://firebasestorage.googleapis.com/v0/b/d-chat-da95e.appspot.com/o/dpimages%2FdefaultUser.png?alt=media&token=6b989378-bde1-4d97-8807-ec3a63c2fd08"
                })
            }).catch(error => {
                alert(error.message);
                setIndicatorVisible(false);
                setElementsVisible(true);

                errorLOAD = true;
            })

            if (!errorLOAD) {
                const ref = db.collection("users").doc(email.toLocaleLowerCase());

                await ref.set({
                    email: email.toLocaleLowerCase(),
                    username: name,
                    dpUrl: imgUrl || "https://firebasestorage.googleapis.com/v0/b/d-chat-da95e.appspot.com/o/dpimages%2FdefaultUser.png?alt=media&token=6b989378-bde1-4d97-8807-ec3a63c2fd08"
                });

                setIndicatorVisible(false);
                setElementsVisible(true);

                navigation.replace("Home");
            }


        }
        else {
            setIndicatorVisible(true);
            setElementsVisible(false);

            await uploadToFirebase(imageBlob, String(email.toLocaleLowerCase())).then(async () => {
                imgUrl = await storage.ref().child(`dpimages/${String(email.toLocaleLowerCase())}.jpg`).getDownloadURL();


                var errorLOAD;

                await auth.createUserWithEmailAndPassword(email.toLocaleLowerCase(), password).then(authUser => {
                    authUser.user.updateProfile({
                        displayName: name,
                        photoURL: imgUrl || "https://firebasestorage.googleapis.com/v0/b/d-chat-da95e.appspot.com/o/dpimages%2FdefaultUser.png?alt=media&token=6b989378-bde1-4d97-8807-ec3a63c2fd08"
                    })
                }).catch( async (error) => {
                    alert(error.message);
                    setIndicatorVisible(false);
                    setElementsVisible(true);
                    await storageRef.child(`dpimages/${String(email.toLocaleLowerCase())}.jpg`).delete();
                    errorLOAD = true;

                })

                if (!errorLOAD) {
                    const ref = db.collection("users").doc(email.toLocaleLowerCase());


                    await ref.set({
                        email: email.toLocaleLowerCase(),
                        username: name,
                        dpUrl: imgUrl || "https://firebasestorage.googleapis.com/v0/b/d-chat-da95e.appspot.com/o/dpimages%2FdefaultUser.png?alt=media&token=6b989378-bde1-4d97-8807-ec3a63c2fd08"
                    });

                    setIndicatorVisible(false);
                    setElementsVisible(true);

                    navigation.replace("Home");
                }
            });


        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", backgroundColor: "#FFFFFF" }} >
            <StatusBar style="light" />
            <ScrollView >
                <View style={styles.container} >
                    <Image source={require("../assets/icon.png")} style={{ width: 200, height: 200, marginTop: 100 }}></Image>
                    {indicatorVisible ? <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        padding: 10
                    }} >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View> : <View />}
                    {elementsVisible ? <View style={{ width: 300 }}>
                        <Input placeholder="Enter your Full Name" keyboardType='default' value={name} onChangeText={text => setName(text)} type="text" autoCorrect={false} autoCapitalize="none" />
                        <Input placeholder="Enter your Email" keyboardType='email-address' value={email} onChangeText={text => setEmail(text)} type="email" autoCorrect={false} autoCapitalize="none" />
                        <Input placeholder="Enter your Password" keyboardType='default' value={password} onChangeText={text => setPassword(text)} secureTextEntry type="password" autoCorrect={false} autoCapitalize="none" />
                    </View> : <View />}

                    {elementsVisible ? <View>
                        <Button onPress={PickImage} containerStyle={styles.button} type="outline" title="Set DP Image"></Button>
                        {uriForAvatar ? <Image source={{ uri: uriForAvatar }} style={{ width: 250, height: 250, margin: 20 }} resizeMode="contain" ></Image> : <Image></Image>}
                        <Button onPress={signUp} disabled={!name || !email || !password} containerStyle={styles.button} type="outline" title="Sign Up" ></Button>
                        <Button onPress={() => navigation.replace('Sign In')} containerStyle={{ marginTop: 20, marginBottom: 15 }} type="outline" title="Have an Account Already, Sign In Now" ></Button>
                    </View> : <View />}
                </View>
            </ScrollView>
        </SafeAreaView>


    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: '#FFFFFF'

    },
    inputContainer: {
        width: 300
    },
    button: {
        // marginTop: 30,
        // marginLeft: 100, 
        // marginRight: 100, 
        marginTop: 20,
        // backgroundColor: "red",

    }
})