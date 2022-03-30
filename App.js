import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import CreateContactScreen from './screens/CreateContactScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import ImageView from './screens/ImageView';



const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "red" },
  headerTitleStyle: { color: "white", fontSize: 25 },
  headerTintColor: "white",
  headerTitleAlign: 'center',

}


export default function App() {

  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen options={{ title: "Please Sign In" }} name='Sign In' component={SignInScreen} />
        <Stack.Screen options={{ title: "Please Sign Up" }} name='Sign Up' component={SignUpScreen} />
        <Stack.Screen options={{ title: "D - CHAT" }} name='Home' component={HomeScreen} />
        <Stack.Screen options={{ title: "Create Contact" }} name='Create Contact' component={CreateContactScreen} />
        <Stack.Screen options={{ title: "D - CHAT | Profile" }} name='Profile' component={ProfileScreen} />
        <Stack.Screen options={{ title: "D - CHAT" }} name='Chat' component={ChatScreen} />
        <Stack.Screen options={{ title: "D - CHAT" }} name='ImageView' component={ImageView} />


      </Stack.Navigator>


    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
