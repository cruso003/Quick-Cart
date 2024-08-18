import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../screens/checkout/styles';

const Header = ({ title, onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.centerElement, styles.backButton]}
        onPress={onBackPress}
      >
        <MaterialIcons name="arrow-back" size={25} color="#fff" />
      </TouchableOpacity>
      <View style={[styles.centerElement, styles.headerTitle]}>
        <Text style={styles.headerTitleText}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;
