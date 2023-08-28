import React, { useState, useEffect, useCallback, useMemo } from "react";
import {View,Text,StyleSheet,ScrollView,TextInput,Pressable,Image,BackHandler, SafeAreaView, FlatList} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import lemonConstants from "./LemonConstants";
import MenuItem from "./MenuItem";
import { useFonts } from "expo-font";
import Avatar from "./Avatar";
import { filterByQueryAndCategories, initializeTable, insertData, fetchMenuItems } from '../data/Database'; // Update the path accordingly
import Filters from '../utils/Filters';
import { useUpdateEffect } from "../utils/UpdateEffect";
import { useIsFocused } from "@react-navigation/native";
import { Searchbar } from 'react-native-paper';
import debounce from "lodash.debounce";

const Home = ({ navigation }) => {
  const API_URL =
    "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [profilePicture, setProfilePicture] = useState(null);
  const [query, setQuery] = useState("");
  const [searchBarText, setSearchBarText] = useState("");
  const [avatarInitials, setInitials] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const sections = ["starters", "mains", "desserts", "drinks"];
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setData(json.menu);
      insertData(json.menu);
    } catch (error) {
      console.error(`Error: ${error}`);
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
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    initializeTable();

    fetchMenuItems((data) => {
      if (data.length > 0) {
        setData(data);
        //DATABASE was loaded
      } else {
        //LOAD from API to Database
        fetchData();
      }
    });
  }, []);

  const renderItem = ({ item }) => <MenuItem menuItem={item} />;

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_data");
      if (jsonValue) {
        const user = JSON.parse(jsonValue);

        setProfilePicture(user.profilePicture);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setInitials(`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`);
      }
    } catch (error) {
      console.error("HOME: Error getting user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
    
  }, [isFocused]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        setData(menuItems);
      } catch (e) {
        //Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  const handleNavigation = () => {
    navigation.navigate("Profile");
  };

  const [loaded] = useFonts({
    MarkaziTextRegular: require("../assets/fonts/MarkaziTextRegular.ttf"),
    KarlaRegular: require("../assets/fonts/KarlaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/images/Logo.png")}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />

        <Pressable onPress={handleNavigation}>
          <View style={styles.avatar}>
            {profilePicture !== null ? (
              <Image
              style={styles.profilePic}
                source={{ uri: profilePicture }}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel={lemonConstants.profilePic}
              />
            ) : (
              <Avatar text={avatarInitials} />
            )}
          </View>
        </Pressable>
      </View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{lemonConstants.littleLemon}</Text>
        <Text style={styles.heroSubTitle}>{lemonConstants.chicago}</Text>
        <View style={styles.heroRow01}>
          <View style={styles.heroLeftRow01}>
            <Text style={styles.heroDescription}>{lemonConstants.intro}</Text>
          </View>

          <View style={styles.heroRightRow01}>
            <Image
              style={styles.heroImage}
              source={require("../assets/images/Heroimage.png")}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.searchBox}>
          <Searchbar
            placeholder="Search"
            placeholderTextColor="white"
            onChangeText={handleSearchChange}
            value={searchBarText}
            style={styles.searchBar}
            iconColor="white"
            inputStyle={{ color: "white" }}
            elevation={0}
          />
        </View>
      </View>
      <View style={styles.orders}>
        <View style={styles.ordersHeader}>
          <Text style={styles.ordersHeaderTitle}>
            {lemonConstants.orderForDelivery}
          </Text>

          <Filters
            selections={filterSelections}
            onChange={handleFiltersChange}
            sections={sections}
          />
        </View>
      </View>

      <View style={styles.menuContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 30,
  },
  logo: {
    height: 75,
    width: 225,
  },
  avatar: {
    marginHorizontal: 12,
  },
  profilePic: {
    height: 70,
    width: 70,
    borderRadius: 50,
  },
  header: {
    flex: 0.6,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  hero: {
    flex: 2,
    width: "100%",
    backgroundColor: "#495E57",
    flexDirection: "column",
  },
  heroRow01: {
    marginTop: 12,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  heroLeftRow01: {
    flex: 2,
  },
  heroRightRow01: {
    flex: 1,
  },
  heroRow02: {},
  heroTitle: {
    fontSize: 54,
    color: "yellow",
    paddingStart: 12,
    fontFamily: "MarkaziTextRegular",
  },
  heroSubTitle: {
    fontSize: 28,
    color: "white",
    paddingStart: 12,
    fontFamily: "KarlaRegular",
    marginTop: -30,
  },
  heroDescription: {
    fontSize: 14,
    color: "white",
    fontFamily: "KarlaRegular",
  },
  heroImage: {
    height: 130,
    width: 120,
    borderRadius: 20,
  },
  searchBox: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  searchBar: {
    marginBottom: 24,
    backgroundColor: "gray",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 18,
    backgroundColor: "lightgray",
  },

  orders: {
    flex: 0.75,
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  ordersHeaderTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  orderButton: {
    flex: 1,
    backgroundColor: "lightgray",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderColor: "black",
    marginHorizontal: 3,
  },
  orderButtonText: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  ordersButtons: {
    flexDirection: "row",
    paddingVertical: 18,
  },
  menuContainer: {
    flex: 1,
  },
});

export default Home;
