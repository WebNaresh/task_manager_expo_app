import NBTextInput from "@/components/input/text-input";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod"; // Add this import
import React from "react";
import { useForm } from "react-hook-form";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const form_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type form_schema_types = z.infer<typeof form_schema>;

const LoginScreen = () => {
  const form = useForm<form_schema_types>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      password: "",
      email: "",
    },
    reValidateMode: "onChange",
  });
  const {
    handleSubmit,
    formState: { errors },
  } = form;
  console.log(`🚀 ~ errors:`, errors);

  const onSubmit = (data: form_schema_types) => {
    console.log(`🚀 ~ data:`, data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to Continue</Text>

        {/* Input Fields */}
        <NBTextInput
          form={form}
          name="email"
          placeholder="eg. admin@gmail.com"
          icon={
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color="#A0A0A0"
            />
          }
          type="text"
        />
        <NBTextInput
          form={form}
          name="password"
          placeholder="Pass@123"
          icon={
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color="#A0A0A0"
            />
          }
          type="password"
        />

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    marginBottom: 48,
  },
  inputContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    color: "#6C63FF",
    fontSize: 14,
    marginBottom: 24,
  },
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;
