import React, { useState, useEffect } from "react";
import {StyleSheet,TextInput,Button,Text,View,Image,Pressable, ScrollView, SafeAreaView,KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from "react-native";
import lemonConstants from "./LemonConstants";
import { useFonts } from "expo-font";
import validator from 'validator';

const Onboarding = () => {
  const [firstName, onChangeFirstName] = useState("");
  const [firstNameIsValid, setfirstNameValidated] = useState(false);
  const [email, onChangeEmail] = useState("");
  const [emailIsValid, setEmailValidated] = useState(false);

  const handleKeyboardDidHide = () => {
    console.log(
      `Keyboard was dismissed firstNameIsValid ${firstNameIsValid} emailIsValid ${emailIsValid}`
    );

    console.log(`authenticated = ${firstNameIsValid && emailIsValid}`);
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDidHide
    );

    return () => {
      keyboardDidHideListener.remove();
    };
    //firstNameIsValid && emailIsValid ? setAuthenticated(true) : setAuthenticated(false);
  }, [firstNameIsValid, emailIsValid]);

  const [loaded] = useFonts({
    MarkaziTextRegular: require("../assets/fonts/MarkaziTextRegular.ttf"),
    KarlaRegular: require("../assets/fonts/KarlaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleFirstNameChange = (text) => {
    onChangeFirstName(text);
    console.log(`handleFirstNameChange.text = ${text}`);
    const validNameRegex = /^[A-Za-z]+$/;

    text.length > 0 && validNameRegex.test(text)
      ? setfirstNameValidated(true)
      : setfirstNameValidated(false);

    console.log(
      `firstNameIsValid = ${firstNameIsValid} text.length > 0 = ${
        text.length > 0
      } validNameRegex.test(text) = ${validNameRegex.test(text)}`
    );
  };

  const handleEmailChange = (text) => {
    onChangeEmail(text);
    console.log(
      `handleEmailChange text = ${text} validator.isEmail(text) ${validator.isEmail(
        text
      )}`
    );
    validator.isEmail(text)
      ? setEmailValidated(true)
      : setEmailValidated(false);

    console.log(
      `emailIsValid = ${emailIsValid}  validator.isEmail(text) = ${validator.isEmail(
        text
      )}`
    );
  };

  const handleNavigation = () => {
    //firstNameIsValid && emailIsValid ? setAuthenticated(true) : setAuthenticated(false);
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
        {firstNameIsValid && emailIsValid ? (
          <Pressable
            onPress={() => handleNavigation}
            style={styles.buttonOn}
            disabled={false}
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
    paddingTop: 40,
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
    fontWeight: "600",
    fontSize: 12,
    paddingBottom: 9,
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
