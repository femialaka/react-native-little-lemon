import React, { useState, useEffect } from "react";
import {StyleSheet,TextInput,Button,Text,View,Image,Pressable, ScrollView, SafeAreaView,KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import lemonConstants from "../utils/LemonConstants";
import { useFonts } from "expo-font";
import validator from 'validator';

const Onboarding = ({navigation}) => {
  const [firstName, onChangeFirstName] = useState("");
  const [firstNameIsValid, setFirstNameValidated] = useState(false);
  const [lastName, onChangeLastName] = useState("");
  const [lastNameIsValid, setLastNameValidated] = useState(false);
  const [email, onChangeEmail] = useState("");
  const [emailIsValid, setEmailValidated] = useState(false);

  const handleKeyboardDidHide = () => {
    //Keyboard was dismissed firstNameIsValid ${firstNameIsValid} emailIsValid ${emailIsValid}
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDidHide
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [firstNameIsValid, emailIsValid]);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(`error: ${e}`);
    }
  };

  const [loaded] = useFonts({
    MarkaziTextRegular: require("../assets/fonts/MarkaziTextRegular.ttf"),
    KarlaRegular: require("../assets/fonts/KarlaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleFirstNameChange = (text) => {
    onChangeFirstName(text);
    const validNameRegex = /^[A-Za-z ]+$/;

    text.length > 0 && validNameRegex.test(text)
      ? setFirstNameValidated(true)
      : setFirstNameValidated(false);
  };

  const handleLastNameChange = (text) => {
    onChangeLastName(text);
    const validNameRegex = /^[A-Za-z ]+$/;

    text.length > 0 && validNameRegex.test(text)
      ? setLastNameValidated(true)
      : setLastNameValidated(false);
  };

  const handleEmailChange = (text) => {
    onChangeEmail(text);

    validator.isEmail(text)
      ? setEmailValidated(true)
      : setEmailValidated(false);

  };

  const clearFormData = () => {
    onChangeFirstName("");
    onChangeLastName("");
    onChangeEmail("");
    setEmailValidated(false);
  }

  const handleNavigation = async () => {

    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: "",
      profilePicture: null,
      orderStatus: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
      avatarInitials: ""
    };
    
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
    finally {
      clearFormData();
      navigation.navigate('Welcome')
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/images/Logo.png")}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
      </View>
      <View style={styles.subheaderContainer}>
        <Text style={styles.subheaderText}>{lemonConstants.getToKnowYou}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle}>{lemonConstants.personalDetails}</Text>
        </View>

        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{lemonConstants.firstName}</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              autoCompleteType="name"
              placeholder={lemonConstants.firstName}
              onChangeText={handleFirstNameChange}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{lemonConstants.lastName}</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              autoCompleteType="name"
              placeholder={lemonConstants.lastName}
              onChangeText={handleLastNameChange}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{lemonConstants.email}</Text>
            <TextInput
              style={styles.input}
              value={email}
              autoCompleteType="email"
              placeholder={lemonConstants.email}
              onChangeText={handleEmailChange}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {(firstNameIsValid && lastNameIsValid && emailIsValid) ? (
          <Pressable
            onPress={handleNavigation}
            style={styles.buttonOn}
            >
            <Text style={styles.buttonTextOn}>{lemonConstants.next}</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.buttonOff} disabled={true}>
            <Text style={styles.buttonTextOff}>{lemonConstants.next}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 30,
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  logo: {
    height: 75,
    width: 225,
  },

  subheaderContainer: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#495E57",
    height: "100%",
  },

  subheaderText: {
    fontFamily: "KarlaRegular",
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
  },

  body: {
    flex: 6,
    paddingHorizontal: 18,
  },

  subTitleContainer: {
    paddingVertical: 45,
  },

  subTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  inputContainer: {
    paddingBottom: 32,
  },
  input: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  inputLabel: {
    fontWeight: "700",
    fontSize: 12,
    paddingBottom: 9,
    fontFamily: 'KarlaRegular'
  },
  footer: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },

  buttonOn: {
    backgroundColor: "#F4CE14",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
  },

  buttonOff: {
    backgroundColor: "lightgray",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
  },

  buttonTextOn: {
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonTextOff: {
    fontWeight: "medium",
    textAlign: "center",
    color: "gray",
  },
});
export default Onboarding;