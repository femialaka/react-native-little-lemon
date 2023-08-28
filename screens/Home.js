import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  SafeAreaView,
  SectionList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import lemonConstants from "../utils/LemonConstants";
import MenuItem from "./MenuItem";
import { useFonts } from "expo-font";
import Constants from "expo-constants";
import Avatar from "./Avatar";
import {
  filterByQueryAndCategories,
  initializeTable,
  insertData,
  fetchMenuItems,
} from "../data/Database"; // Update the path accordingly
import Filters from "../utils/Filters";
import { useUpdateEffect, getSectionListData } from "../utils/Utils";
import { useIsFocused } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
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

      const menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));

      return menu;
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    (async () => {
      let menuItems = [];
      try {
        await initializeTable();
        menuItems = await fetchMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          const sectionListDataFromApi = getSectionListData(menuItems);
          setData(sectionListDataFromApi);
          insertData(menuItems);
        } else {
          const sectionListData = getSectionListData(menuItems);
          setData(sectionListData);
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
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

  const setUserAuth = async () => {
    const userAuth = { isOnboarded: true };
    try {
      await AsyncStorage.setItem("user_auth", JSON.stringify(userAuth));
    } catch (error) {
      console.error("HOME: Error saving user Auth:", error);
    } finally {
      getUserAuth();
    }
  };

  const getUserAuth = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_auth");
      if (jsonValue) {
        const userAuth = JSON.parse(jsonValue);
      }
    } catch (error) {
      console.error("HOME: Error getting user Auth:", error);
    }
  };

  useEffect(() => {
    setUserAuth();
  }, []);

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
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
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
        <Text style={styles.heroHeader}>{lemonConstants.littleLemon}</Text>
        <View style={styles.heroContainer}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubHeader}>{lemonConstants.chicago}</Text>
            <Text style={styles.heroIntroText}>{lemonConstants.intro}</Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../assets/images/Heroimage.png")}
            accessible={true}
            accessibilityLabel={lemonConstants.littleLemonRestaurant}
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#495e57"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="#495e57"
          inputStyle={{ color: "#495e57" }}
          elevation={3}
        />
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
        <SectionList
          style={styles.sectionList}
          sections={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { name } }) => (
            <Text style={styles.itemHeader}>{name}</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
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
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  hero: {
    backgroundColor: "#495e57",
    padding: 15,
  },
  heroHeader: {
    color: "#f4ce14",
    fontSize: 54,
    fontFamily: "MarkaziTextRegular",
  },
  heroSubHeader: {
    color: "#fff",
    fontSize: 36,
    fontFamily: "MarkaziTextRegular",
    marginTop: -36,
  },
  heroIntroText: {
    color: "#fff",
    fontFamily: "KarlaRegular",
    fontSize: 14,
  },
  heroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBox: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
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
  itemHeader: {
    fontSize: 22,
    paddingVertical: 2,
    paddingHorizontal: 12,
    color: "#495e57",
    backgroundColor: "#fbe5db",
    borderRadius: 9,
    fontFamily: "KarlaRegular",
  },
});

export default Home;
