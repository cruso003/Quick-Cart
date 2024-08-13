import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import defaultImage from '../../../assets/defaultCategory.png';

const CategoryItem = ({ item, isSelected, onPress }) => {
  const imageSource = item.image_Url ? { uri: item.image_Url } : defaultImage;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          { borderColor: isSelected ? 'red' : 'transparent' },
        ]}
      >
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default CategoryItem;
