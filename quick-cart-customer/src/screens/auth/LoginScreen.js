import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "../../../theme/colors";
import AppForm from "../../components/form/AppForm";
import AppFormField from "../../components/form/AppFormField";
import * as Yup from "yup";
import tailwind from "twrnc";
import SubmitButton from "../../components/button/SubmitButton";
import Divider from "../../components/divider/Divider";
import { useAuth } from "../../../context/auth";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginScreen = () => {
  const { login, error, isLoading } = useAuth();
  const navigation = useNavigation();

  const handleLogin = (values) => {
    login(values.email, values.password);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topHalf}>
        <View>
          <Image
            source={require('../../../assets/quick-cart.png')}
            style={styles.logo}
          />
        </View>
      </SafeAreaView>
      <View style={styles.bottomHalf}>
        <View>
          <AppForm
            initialValues={{ email: '', password: '' }}
            onSubmit={handleLogin}
            validationSchema={validationSchema}
          >
            <AppFormField
              name='email'
              label='Email'
              leftIcon='email'
              placeholder='Email'
              disabled={isLoading}
            />
            <AppFormField
              name='password'
              label='Password'
              leftIcon='lock'
              rightIcon='eye'
              secureTextEntry={true}
              disabled={isLoading}
              placeholder='Password'
            />
            <View style={tailwind`flex-row-reverse`}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <SubmitButton title='Login' disable={isLoading} loader={isLoading} />
          </AppForm>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Divider />
          <View style={styles.googleButton}>
            <TouchableOpacity style={tailwind`mb-[4px] ml-2`}>
              <Image
                source={require('../../../assets/google.jpg')}
                style={styles.googleIcon}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, marginLeft: 5 }}>
              Sign in with Google
            </Text>
          </View>
          <Divider />
          <View style={tailwind`flex-row`}>
            <Text style={tailwind`ml-4`}>Don't have an Account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.primary,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
  topHalf: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  logo: {
    width: 250,
    height: 250,
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  inputTitle: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  input: {
    padding: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    marginLeft: 16,
  },
  googleButton: {
    flexDirection: 'row',
    width: '60%',
    height: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginLeft: 60,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    marginRight: 16,
    marginTop: 16,
  },
  errorText: {
    color: colors.danger,
    marginLeft: 16,
    marginTop: 16,
  },
});
