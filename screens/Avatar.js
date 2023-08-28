import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = ({ text }) => {
    return (
      <View style={styles.circle}>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    circle: {
      width: 90,
      height: 90,
      borderRadius: 50,
      backgroundColor: 'lightgray',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: 'black', // Text color
      fontSize: 36,
      fontWeight: '600'
    },
  });
  
  export default Avatar;