import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import lemonConstants from "../utils/LemonConstants";
import { StatusBar } from "expo-status-bar";
import Avatar from "./Avatar";
import CheckBox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validator from "validator";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";

const Profile = ({ navigation }) => {
  const [firstName, onChangeFirstName] = useState("");
  const [firstNameIsValid, setFirstNameValidated] = useState(false);
  const [lastName, onChangeLastName] = useState("");
  const [lastNameIsValid, setLastNameValidated] = useState(false);
  const [email, onChangeEmail] = useState("");
  const [emailIsValid, setEmailValidated] = useState(false);
  const [phone, onChangePhone] = useState("");
  const [phoneIsValid, setPhoneValidated] = useState(false);
  const [orderStatusCheckBox, setOrderStatusCheckBoxToggle] = useState(false);
  const [passwordChangesCheckBox, setPasswordChangesCheckBoxToggle] =
    useState(false);
  const [specialOffersCheckBox, setSpecialOffersCheckBoxToggle] =
    useState(false);
  const [newsletterCheckBox, setNewsletterCheckBoxToggle] = useState(false);
  const [profilePicture, onChangeProfilePicture] = useState(null);
  const [avatarInitials, setInitials] = useState("");

  const getUserData = async () => {
    try {
      const jsonAuthValue = await AsyncStorage.getItem("user_auth");
      const jsonValue = await AsyncStorage.getItem("user_data");
      if (jsonAuthValue) {
        const userAuth = JSON.parse(jsonAuthValue);
      }
      if (jsonValue) {
        const user = JSON.parse(jsonValue);
        onChangeFirstName(user.firstName);
        onChangeLastName(user.lastName);
        onChangeEmail(user.email);
        onChangePhone(user.phone);
        onChangeProfilePicture(user.profilePicture);
        setOrderStatusCheckBoxToggle(user.orderStatus);
        setPasswordChangesCheckBoxToggle(user.passwordChanges);
        setSpecialOffersCheckBoxToggle(user.specialOffers);
        setNewsletterCheckBoxToggle(user.newsletter);
        setInitials(`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`);
      }
    } catch (error) {
      console.error("PROFILE: Error getting user data:", error);
    } finally {
      getUserAuth();
    }
  };

  const saveUserData = async () => {
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      profilePicture: profilePicture,
      orderStatus: orderStatusCheckBox,
      passwordChanges: passwordChangesCheckBox,
      specialOffers: specialOffersCheckBox,
      newsletter: newsletterCheckBox,
      avatarInitials: avatarInitials,
    };

    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(user));
    } catch (error) {
      console.error("PROFILE: Error saving user data:", error);
    } finally {
      navigation.navigate("Home");
    }
  };

  const clearUserData = async () => {
    const userAuth = {
      isOnboarded: false,
    };

    const user = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profilePicture: null,
      orderStatus: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
      avatarInitials: "",
    };

    try {
      await AsyncStorage.setItem("user_auth", JSON.stringify(userAuth));
      await AsyncStorage.setItem("user_data", JSON.stringify(user));
    } catch (error) {
      console.error("PROFILE: Error saving user data:", error);
    } finally {
      navigation.navigate("Onboarding");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleLogout = async () => {
    clearUserData();
  };

  const getUserAuth = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_auth");
      if (jsonValue) {
        const userAuth = JSON.parse(jsonValue);
      }
    } catch (error) {
      console.error("PROFILE: Error getting user Auth:", error);
    }
  };

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

  const handlePhoneChange = (text) => {
    onChangePhone(text);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onChangeProfilePicture(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onChangeProfilePicture(null);
  };

  const [loaded] = useFonts({
    MarkaziTextRegular: require("../assets/fonts/MarkaziTextRegular.ttf"),
    KarlaRegular: require("../assets/fonts/KarlaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/images/Logo.png")}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel={"Little Lemon Logo"}
          />

          <View style={styles.avatar}>
            {profilePicture === null ? (
              <Avatar text={avatarInitials} />
            ) : (
              <Image
                style={styles.profilePic}
                source={{ uri: profilePicture }}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel={"profile picture"}
              />
            )}
          </View>
        </View>
        <View style={styles.personalInfo}>
          <Text style={styles.personalInfoText}>
            {lemonConstants.personalDetails}
          </Text>

          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              {profilePicture === null ? (
                <Avatar text={avatarInitials} />
              ) : (
                <Image
                  style={styles.profilePic}
                  source={{ uri: profilePicture }}
                  resizeMode="contain"
                  accessible={true}
                  accessibilityLabel={"profile picture"}
                />
              )}
            </View>

            <View style={styles.avatarButtonsRow}>
              <Pressable style={styles.avatarButton} onPress={pickImage}>
                <Text style={styles.avatarButtonText}>
                  {lemonConstants.change}
                </Text>
              </Pressable>
              <Pressable onPress={removeImage} style={styles.avatarButton}>
                <Text style={styles.avatarButtonText}>
                  {lemonConstants.remove}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.form}>
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
              keyboardType="email-address"
              placeholder={lemonConstants.email}
              onChangeText={handleEmailChange}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{lemonConstants.phoneNumber}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              autoCompleteType="name"
              keyboardType="phone-pad"
              placeholder={lemonConstants.phoneNumber}
              onChangeText={handlePhoneChange}
            />
          </View>
        </View>
        <View style={styles.emailOptionsContainer}>
          <View style={styles.emailOptions}>
            <CheckBox
              value={newsletterCheckBox}
              onValueChange={() =>
                setNewsletterCheckBoxToggle(!newsletterCheckBox)
              }
              color={newsletterCheckBox ? "#4630EB" : undefined}
            />
            <Text style={styles.checkboxText}>Newsletter</Text>
          </View>
          <View style={styles.emailOptions}>
            <CheckBox
              value={orderStatusCheckBox}
              onValueChange={() =>
                setOrderStatusCheckBoxToggle(!orderStatusCheckBox)
              }
              color={orderStatusCheckBox ? "#4630EB" : undefined}
            />
            <Text style={styles.checkboxText}>Order status</Text>
          </View>
          <View style={styles.emailOptions}>
            <CheckBox
              value={passwordChangesCheckBox}
              onValueChange={() =>
                setPasswordChangesCheckBoxToggle(!passwordChangesCheckBox)
              }
              color={passwordChangesCheckBox ? "#4630EB" : undefined}
            />
            <Text style={styles.checkboxText}>Password Changes</Text>
          </View>
          <View style={styles.emailOptions}>
            <CheckBox
              value={specialOffersCheckBox}
              onValueChange={() =>
                setSpecialOffersCheckBoxToggle(!specialOffersCheckBox)
              }
              color={specialOffersCheckBox ? "#4630EB" : undefined}
            />
            <Text style={styles.checkboxText}>Special offers</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.logoutButton}>
            <Pressable onPress={handleLogout} style={styles.buttonOn}>
              <Text style={styles.logoutButtonText}>
                {lemonConstants.logout}
              </Text>
            </Pressable>
          </View>

          <View style={styles.buttonRowContainer}>
            <Pressable
              onPress={() => navigation.navigate("Home")}
              style={styles.buttonRow}
              disabled={false}
            >
              <Text style={styles.buttonTextOn}>
                {lemonConstants.discardChanges}
              </Text>
            </Pressable>
            <Pressable
              onPress={saveUserData}
              style={styles.buttonRow}
              disabled={false}
            >
              <Text style={styles.buttonTextOn}>
                {lemonConstants.saveChanges}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollContainer: {
    //flexGrow: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 30,
    paddingHorizontal: 12,
  },
  logo: {
    height: 75,
    width: 225,
  },

  profilePic: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  personalInfo: {
    flex: 2.5,
    width: "100%",
    flexDirection: "column",
    //backgroundColor: "pink",
    paddingVertical: 12,
  },
  personalInfoText: {
    fontFamily: "KarlaRegular",
    fontWeight: "700",
    fontSize: 18,
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    marginVertical: 12,
  },
  avatarButtonsRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButton: {
    flex: 1,
    backgroundColor: "#495E57",
    borderRadius: 12,
    borderColor: "black",
    marginHorizontal: 12,
    height: 54,
    alignContent: "center",
    justifyContent: "center",
  },
  avatarButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  form: {
    flex: 7,
    flexDirection: "column",
    width: "100%",
    //backgroundColor: "yellow",
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
    fontFamily: "KarlaRegular",
  },
  emailOptionsContainer: {
    flex: 2.5,
    flexDirection: "column",
    width: "100%",
    //backgroundColor: "green",
  },
  emailOptions: {
    paddingVertical: 12,
    flexDirection: "row",
  },
  checkboxText: {
    marginStart: 21,
  },
  footer: {
    flex: 2.5,
    flexDirection: "column",
    width: "100%",
    //backgroundColor: "blue",
  },
  buttonOn: {
    backgroundColor: "#F4CE14",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
  },
  buttonRow: {
    flex: 1,
    backgroundColor: "#495E57",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderColor: "black",
    marginHorizontal: 12,
  },

  buttonRowContainer: {
    flexDirection: "row",
    paddingVertical: 24,
  },
  buttonTextOn: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    color: "#F0EEE1",
  },
  logoutButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    paddingVertical: 24,
  },
});
