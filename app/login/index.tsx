import { base_url } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LoginProps {
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}
type RootStackParamList = {
  Home: undefined;
  RMDash: undefined;
  // Add other screen names and their params here
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Login: React.FC<LoginProps> = ({ setUserRole }) => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      console.log(`🚀 ~ credentials:`, credentials);
      console.log(`🚀 ~ :`, `${base_url}/api/v1/auth/login`);
      const response = await axios.post(
        `${base_url}/api/v1/auth/login`,
        credentials
      );
      console.log(`🚀 ~ response:`, response);

      return response.data;
    },
    onSuccess: async (data: any) => {
      if (data && data.role) {
        Alert.alert("Login Successfully");
        console.log("Login Successfully", data.role);

        const userRole = data.role.trim().toUpperCase();
        console.log(`🚀 ~ userRole:`, userRole);
        await AsyncStorage.setItem("userRole", userRole);
        setUserRole(userRole);

        if (userRole === "ADMIN") {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "RMDash" }],
          });
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid Credentials");
      }
    },
    onError: (error) => {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Login Error:", error);
    },
  });

  const handleLogin = () => {
    console.log(`🚀 ~ handleLogin:`);
    loginMutation.mutate({ email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Ionicons name="checkmark" size={50} color="#fff" />
        </View>
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to Continue</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <Ionicons name="mail" size={20} color="#9CA3AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons
            name="lock-closed"
            size={20}
            color="#9CA3AF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    backgroundColor: "#4C67FF",
    height: 50,
    width: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#000",
    marginTop: -20,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
    marginTop: 30,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgotText: {
    fontSize: 14,
    color: "#4C67FF",
    marginLeft: 130,
    marginBottom: 20,
  },
  loginButton: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;
