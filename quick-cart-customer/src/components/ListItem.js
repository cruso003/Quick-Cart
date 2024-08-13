import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import TouchablePlatformSpecific from './TouchablePlatformSpecific';
import colors from '../../theme/colors';


const ListItem = ({ iconName, iconComponent: IconComponent, label, onPress }) => (
    <TouchablePlatformSpecific
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple("#ccc", false)}
      useForeground={true}
    >
      <View style={styles.container}>
        <IconComponent name={iconName} size={30} color={colors.black} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchablePlatformSpecific>
  );
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderColor: "#f6f6f6",
      alignItems: "center",
    marginTop: 10,
    },
    label: {
      marginLeft: 16,
      fontSize: 20,
      color: "#282828",
    },
  });
  
  export default ListItem;