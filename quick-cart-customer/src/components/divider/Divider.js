import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import tailwind from 'twrnc';
import colors from '../../../theme/colors';


const Divider = ()=> {
  return (
    <View style={styles.container}>
      <View style={styles.divider}></View>
      <Text style={tailwind`text-lg m-2`}>or</Text>
      <View style={styles.divider}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.black,
  },
  text: {
    paddingHorizontal: 2,
  },
});

export default Divider;
