import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import lemonConstants from "./LemonConstants";
import { useFonts } from "expo-font";

const MenuItem = ({ menuItem }) => {
  const [loaded] = useFonts({
    MarkaziTextRegular: require("../assets/fonts/MarkaziTextRegular.ttf"),
    KarlaRegular: require("../assets/fonts/KarlaRegular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.menuItemContainer}>
      <View style={styles.menuItemDetailColumn}>
        <Text style={styles.menuItemTitle}>{menuItem.name}</Text>
        <Text style={styles.menuItemDescription}>{menuItem.description}</Text>
        <Text style={styles.menuItemPrice}>{menuItem.price}</Text>
      </View>
      <View style={styles.menuItemImageColumn}>
        <Image
          style={styles.menuItemImage}
          source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${menuItem.image}?raw=true` }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    flex: 1,
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  menuItemDetailColumn: {
    marginEnd: 12,
    width: '70%'
  },
  menuItemImage: {
    width: '30%',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop:20,
    height: 100,
    width: 100,
  },
  menuItemImageColumn: {
   flex: 1
  },
  menuItemTitle: {
    fontWeight: "800",
    fontSize: 16,
  },
  menuItemDescription: {
    paddingVertical: 9,
    fontSize: 12,
    fontFamily: 'KarlaRegular'
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'KarlaRegular'
  },
});

export default MenuItem;
