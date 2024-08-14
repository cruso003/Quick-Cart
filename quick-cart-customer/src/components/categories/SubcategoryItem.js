import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import defaultImage from '../../../assets/defaultCategory.png';

const SubCategoryItem = ({ item, onPress }) => {
  const imageSource = item.image ? { uri: item.image } : defaultImage;
  const limitedName = item.name.length > 15 ? `${item.name.substr(0, 15)}...` : item.name;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <ImageBackground source={imageSource} style={styles.image} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <Text style={styles.text}>{limitedName}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 7,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    width: 80,
    height: 80,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
  },
  text: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SubCategoryItem;
