import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import defaultImage from '../../../assets/defaultCategory.png';

const CategoryItem = ({ item, isSelected, onPress }) => {
  const imageSource = item.image ? { uri: item.image } : defaultImage;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          { borderColor: isSelected ? 'red' : 'transparent' },
        ]}
      >
        <ImageBackground source={imageSource} style={styles.image} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 3,
    overflow: 'hidden',
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 6,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default CategoryItem;
