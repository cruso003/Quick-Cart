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
import SubmitButton from "../../components/button/SubmitButton";
import userApi from "../../../api/user/user";
import Divider from "../../components/divider/Divider";
import tailwind from "twrnc";

const validationSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .test('passwords-match', 'Passwords must match', function(value) {
      return this.parent.newPassword === value;
    }),
});

const VerifyOtp = ({ route}) => {
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const { email } = route.params;

  const handleOtpVerification = async (values) => {
    setLoading(true);
    setError('');
    const { otp, newPassword } = values;
    try {
      const response = await userApi.verifyOtpAndResetPassword({
        email,
        securityCode: otp,
        newPassword,
      });

      if (response.status === 200) {
        navigation.navigate("Login")
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userApi.resendSecurityCode(email);

      if (response.status === 200) {
        setError('OTP sent successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Resend OTP failed');
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
          initialValues={{ otp: '', newPassword: '', confirmPassword: '' }}
          onSubmit={handleOtpVerification}
          validationSchema={validationSchema}
        >
          <AppFormField
            name="otp"
            label="OTP"
            leftIcon='key'
            placeholder="Enter OTP"
            keyboardType="numeric"
            disabled={loading}
          />

          <AppFormField
            name="newPassword"
            label="New Password"
            leftIcon='lock'
            placeholder="Enter new password"
            secureTextEntry={true}
            disabled={loading}
          />

          <AppFormField
            name="confirmPassword"
            label="Confirm Password"
            leftIcon='lock'
            placeholder="Confirm new password"
            secureTextEntry={true}
            diabled={loading}
          />

          <SubmitButton title='VerifyOtp and Reset' disable={loading} loader={loading} />
        </AppForm>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Divider />
        <View style={tailwind`flex-row`}>
          <Text style={tailwind`ml-4`}>Code Expired? </Text>
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={{color: colors.danger}}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
  );
};

export default VerifyOtp;

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
