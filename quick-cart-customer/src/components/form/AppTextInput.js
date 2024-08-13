import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import tw from 'twrnc';


function AppTextInput({
  label,
  leftIcon,
  rightIcon,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  onBlur,
  disabled = false,
  ...otherProps
}) {
  const [secure, setSecure] = useState(secureTextEntry);

  const toggleSecureTextEntry = () => {
    setSecure((prevState) => !prevState);
  };

  return (
    <View style={tw`mt-2`}>
      <TextInput
        mode="outlined"
        label={label}
        left={<TextInput.Icon icon={leftIcon} color="#F1F5F9" />}
        right={
          rightIcon && (
            <TextInput.Icon
              icon={secure ? 'eye' : 'eye-off'}
              onPress={toggleSecureTextEntry}
              color="#CBD5E1"
            />
          )
        }
        secureTextEntry={secure}
        onChangeText={onChangeText}
        disabled={disabled}
        value={value}
        theme={{ roundness: 10 }}
        style={disabled ? tw`bg-gray-800` : tw`bg-neutral-900`}
        activeOutlineColor="#CBD5E1"
        textColor="#CBD5E1"
        placeholder={placeholder}
        onBlur={onBlur}
        {...otherProps}
      />
    </View>
  );
}

export default AppTextInput;
