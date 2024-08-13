import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import defaultImage from '../../../assets/defaultCategory.png';

const SubCategoryItem = ({ item, onPress }) => {
  const imageSource = item.image_Url ? { uri: item.image_Url } : defaultImage;
  const limitedName = item.title.length > 15 ? `${item.title.substr(0, 15)}...` : item.title;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.text}>{limitedName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 7,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  image: {
    width: 30,
    height: 30,
  },
  text: {
    marginLeft: 5,
  },
});

export default SubCategoryItem;
