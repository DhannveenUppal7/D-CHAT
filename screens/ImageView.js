import React from 'react'
import { StyleSheet, Text, View, ImageBackground } from 'react-native'

const ImageView = ({ navigation, route }) => {

    console.log(route.params.imageSource);
    return (
        // <View>
        //     <Image source={{uri: route.params.imageSource}} style={{height: 200, width: 200 }}></Image>

        // </View>
        <View style={styles.container}>
            <ImageBackground source={{ uri: route.params.imageSource }} resizeMode="contain" style={styles.image}>
            </ImageBackground>

        </View>

    )
}

export default ImageView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
})
