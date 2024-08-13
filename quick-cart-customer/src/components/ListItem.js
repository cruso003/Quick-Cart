import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import TouchablePlatformSpecific from "./TouchablePlatformSpecific";
import colors from "../../theme/colors";

const ListItem = ({
  iconName,
  iconComponent: IconComponent,
  label,
  onPress,
}) => (
  <TouchablePlatformSpecific
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple("#ccc", false)}
    useForeground={true}
    style={{
      flexDirection: "row",
      backgroundColor: colors.bg,
      marginVertical: 4,
      height: 80,
      borderRadius: 25
    }}
  >
    <View style={{ width: 75, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ececec",
          padding: 7,
          borderRadius: 25,
        }}
      >
        <IconComponent name={iconName} size={28} color={colors.black} />
      </View>
    </View>

    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  </TouchablePlatformSpecific>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: 'center',
  },
  label: {
    marginLeft: 16,
    fontSize: 20,
    color: "#282828",
  },
});

export default ListItem;
