import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { Icon } from '../assets/icon.png'
import { auth } from '../firebase';

const SignInScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [indicatorVisible, setIndicatorVisible] = useState(false);
    const [elementsVisible, setElementsVisible] = useState(true);

    useEffect(() => {
        const logger = auth.onAuthStateChanged((autherUser) => {
            if (autherUser) {
                navigation.replace("Home");

            }
        });
        return logger;
    }, [])

    

    const signIn = () => {


        setIndicatorVisible(true);
        setElementsVisible(false);


        auth.signInWithEmailAndPassword(email.toLocaleLowerCase(), password).catch(error => alert(error));

        setIndicatorVisible(false);
        setElementsVisible(true);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Image source={require("../assets/icon.png")} style={{ width: 200, height: 200 }}></Image>
            {indicatorVisible ? <View style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 10,
            }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View> : <View />}
            {elementsVisible ? <View style={{ width: 300 }} >
                <Input placeholder="Enter your Email" type="email" value={email} onChangeText={(text) => setEmail(text)} keyboardType="email-address" autoCorrect={false} autoCapitalize="none" />
                <Input placeholder="Enter your Password" autoFocus secureTextEntry value={password} type="password" onChangeText={(text) => setPassword(text)} autoCorrect={false} autoCapitalize="none"  />

                <Button containerStyle={styles.button} type="outline" onPress={signIn} disabled={!email || !password} title="Sign In"></Button>
                <Button onPress={() => navigation.replace('Sign Up')} containerStyle={{ marginTop: 20, marginBottom: 15 }} type="outline" title="Don't Have an Account, Sign Up Now"></Button>

            </View> : <View />}
        </View>
    )
}

export default SignInScreen

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
