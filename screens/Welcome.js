import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import lemonConstants from "./LemonConstants";
import { useFonts } from "expo-font";

const Welcome = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const isFocused = useIsFocused();

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_data");
      if (jsonValue) {
        const user = JSON.parse(jsonValue);
        setProfilePicture(user.profilePicture);
        setFirstName(user.firstName);
      }
    } catch (error) {
      console.error("WELCOME: Error getting user data:", error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      return true; // or true to handle the back button press
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    // Clean up the event listener when the component unmounts
    return () => backHandler.remove();
  }, []);


  useEffect(() => {
    getUserData();
  }, [isFocused]);

  const handleProfileNav = async () => {
    navigation.navigate('Profile');
  };

  const handleHomeNav = async () => {
    navigation.navigate('Home');
  };

  const [loaded] = useFonts({
    MarkaziTextRegular: require("../assets/fonts/MarkaziTextRegular.ttf"),
    KarlaRegular: require("../assets/fonts/KarlaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{(`${lemonConstants.congratulations} ${firstName} ${lemonConstants.youHaveRegistered}`)} </Text>
      <Pressable
        onPress={handleHomeNav}
        style={styles.homeButton}
        disabled={false}
      >
        <Text style={styles.homeButtonText}>{lemonConstants.continue}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        color: "#495E57",
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 36,
        fontFamily: 'KarlaRegular'
    },
    homeButton: {
        marginTop: 80,
        backgroundColor: "#495E57",
        padding: 12,
        borderRadius:20
    },
    homeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 26,
        fontFamily: 'KarlaRegular'
    }
});

export default Welcome;