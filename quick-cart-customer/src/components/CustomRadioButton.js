import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

const CustomRadioButton = ({ value, selectedValue, onPress, label }) => (
  <TouchableOpacity style={styles.container} onPress={() => onPress(value)}>
    <View style={[styles.circle, selectedValue === value && styles.selectedCircle]}>
      {selectedValue === value && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: colors.white,
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 16,
  },
});

export default CustomRadioButton;
