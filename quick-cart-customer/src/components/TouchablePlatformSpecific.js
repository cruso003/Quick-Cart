import React from "react";
import { TouchableOpacity, TouchableNativeFeedback, Platform, View } from "react-native";

const TouchablePlatformSpecific = ({ children, onPress, style, background, useForeground }) => {
  return (
    Platform.OS === "ios" ? (
      <TouchableOpacity onPress={onPress} style={style}>
        {children}
      </TouchableOpacity>
    ) : (
      <TouchableNativeFeedback onPress={onPress} background={background} useForeground={useForeground}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    )
  );
};

export default TouchablePlatformSpecific;
