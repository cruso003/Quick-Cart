import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../theme/colors";
import AppForm from "../../components/form/AppForm";
import AppFormField from "../../components/form/AppFormField";
import * as Yup from "yup";
import SubmitButton from "../../components/button/SubmitButton";
import userApi from "../../../api/user/user";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleReset = async (values) => {
    setLoading(true);
    setError('');
    const { email } = values;
    try {
      const response = await userApi.forgotPassword(email);
      // Navigate to the OTP verification screen
      if (response.status === 200 || 201) {
       navigation.navigate("VerifyOtp", {email})
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
            initialValues={{ email: ''}}
            onSubmit={handleReset}
            validationSchema={validationSchema}
          >
            <AppFormField
              name="email"
              label="Email"
              leftIcon="email"
              placeholder="Email"
              disabled={loading}
            />
           
            <SubmitButton title="Reset Password" disable={loading} loader={loading} />
          </AppForm>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;

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
  inputTitle: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: "bold",
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
  errorText: {
    color: colors.danger,
    marginLeft: 16,
    marginTop: 16,
  },
});
