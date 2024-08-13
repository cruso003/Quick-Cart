import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import colors from "../../../theme/colors";
  import AppForm from "../../components/form/AppForm";
  import AppFormField from "../../components/form/AppFormField";
  import * as Yup from "yup";
  import tailwind from "twrnc";
  import SubmitButton from "../../components/button/SubmitButton";
  import Divider from "../../components/divider/Divider";
  import authApi from "../../../api/auth/auth";
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  
  const RegisterScreen = () => {
    const [error, setError] = useState("");
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
  
    const handleRegister = async (values) => {
      try {
        setLoading(true);
  
        await authApi.register(values);
  
        // Navigate to Login
        navigation.navigate("Login");
      } catch (error) {
        setError(error.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.topHalf}>
          <View>
            <Image
              source={require("../../../assets/quick-cart.png")}
              style={styles.logo}
            />
          </View>
        </SafeAreaView>
        <View style={styles.bottomHalf}>
          <View>
            <AppForm
              initialValues={{ name: "", email: "", password: "", role: "" }}
              onSubmit={handleRegister}
              validationSchema={validationSchema}
            >
              <AppFormField
                name="name"
                label="Full Name"
                leftIcon="account"
                placeholder="Name"
                disabled={loading}
              />
              <AppFormField
                name="email"
                label="Email"
                leftIcon="email"
                placeholder="Email"
                disabled={loading}
              />
              <AppFormField
                name="password"
                label="Password"
                leftIcon="lock"
                rightIcon="eye"
                secureTextEntry={true}
                disabled={loading}
                placeholder="Password"
              />
              <SubmitButton title="Register" disable={loading} loader={loading} />
            </AppForm>
  
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Divider />
          <View style={styles.googleButton}>
            <TouchableOpacity style={tailwind`mb-[4px] ml-2`}>
              <Image
                source={require("../../../assets/google.jpg")}
                style={styles.googleIcon}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, marginLeft: 5 }}>
              Sign up with Google
            </Text>
          </View>
          <Divider />
            <View style={tailwind`flex-row`}>
              <Text style={tailwind`ml-4`}>Already have an Account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: colors.primary }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.black,
      flex: 1,
    },
    topHalf: {
      flexDirection: "row",
      justifyContent: "center",
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
    googleButton: {
        flexDirection: "row",
        width: "60%",
        height: 50,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white,
        marginLeft: 60,
      },
      googleIcon: {
        width: 24,
        height: 24,
      },
    errorText: {
      color: colors.danger,
      marginLeft: 16,
      marginTop: 16,
    },
  });
  