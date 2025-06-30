import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import showToast from "@/components/ui/toast";
import { error_color, primary_color, success_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod"; // Add this import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { z } from "zod";

const { width, height } = Dimensions.get("window");

const form_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type form_schema_types = z.infer<typeof form_schema>;

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#181c24" : "#f0f4f8",
    },
    gradientBackground: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: keyboardVisible ? "flex-start" : "center",
      paddingTop: keyboardVisible ? 20 : 0,
    },
    content: {
      width: "100%",
      alignItems: "center",
      paddingBottom: Platform.OS === "ios" ? 40 : 20,
    },
    logoContainer: {
      width: keyboardVisible ? 80 : 120,
      height: keyboardVisible ? 80 : 120,
      borderRadius: keyboardVisible ? 40 : 60,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: keyboardVisible ? 10 : 20,
      marginTop: keyboardVisible ? 20 : 0,
      ...(Platform.OS === "web"
        ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }),
      alignSelf: "center",
    },
    logo: {
      width: keyboardVisible ? 70 : 100,
      height: keyboardVisible ? 70 : 100,
      borderRadius: 150,
    },
    formCardWrapper: {
      width: "90%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 24,
      paddingTop: keyboardVisible ? 16 : 24,
      alignSelf: "center",
      backgroundColor: isDarkMode
        ? "rgba(30,34,42,0.8)"
        : "rgba(255,255,255,0.9)",
      borderRadius: 24,
      ...(Platform.OS === "web"
        ? { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }),
    },
    inputsContainer: {
      width: "100%",
      gap: 20,
      marginVertical: keyboardVisible ? 16 : 32,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? "rgba(30,34,42,0.8)"
        : "rgba(255,255,255,0.9)",
    },
    signInButton: {
      width: "100%",
      borderRadius: 16,
      paddingVertical: 16,
      marginBottom: keyboardVisible ? 12 : 24,
      backgroundColor: primary_color,
    },
    signInButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
      letterSpacing: 0.5,
    },
    forgotPassword: {
      color: isDarkMode ? "#b0b8c9" : primary_color,
      fontSize: 16,
      textAlign: "center",
      textDecorationLine: "underline",
    },
  });

  const form = useForm<form_schema_types>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
  });
  const { mutate } = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      const response = await axios.put(
        `/api/v1/auth/update-user-status/${user?.id}`,
        data
      );

      return response.data;
    },
  });
  const { handleSubmit } = form;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: form_schema_types) => {
      console.log("🚀 Login attempt with data:", data);
      await queryClient.invalidateQueries({
        queryKey: ["token"],
      });
      const response = await axios.post("/api/v1/auth/login", data);
      console.log("🚀 Login response:", response.data);
      return response.data;
    },
    async onSuccess(data, _variables, _context) {
      console.log("🚀 Login success with data:", data);

      // Check authorization first before proceeding
      if (data.role !== "RM" && data.role !== "ADMIN") {
        showToast("You are not authorized to login", {
          backgroundColor: error_color,
        });
        return;
      }

      // Show welcome message
      showToast(`Welcome, ${data?.name}`, {
        backgroundColor: success_color,
      });

      try {
        // Store token first
        await AsyncStorage.setItem("token", data.token);
        console.log("🚀 Token stored successfully");

        // Invalidate queries to refresh auth state
        await queryClient.invalidateQueries({
          queryKey: ["token"],
        });
        console.log("🚀 Queries invalidated");

        // Update user status
        mutate({ isActive: true });

        // Navigate based on role
        if (data.role === "RM") {
          router.push("/(manager)/dashboard");
        } else if (data.role === "ADMIN") {
          router.push("/(admin)/dashboard");
        }

        console.log("🚀 Navigation completed");
      } catch (error) {
        console.error("🚀 Error in login success handler:", error);
        showToast(
          "Login successful but there was an issue. Please try again.",
          {
            backgroundColor: error_color,
          }
        );
      }
    },
    onError(error, _variables, _context) {
      console.error("🚀 Login error:", error);

      if (axios.isAxiosError(error)) {
        if (error.code === "NETWORK_ERROR" || error.code === "ECONNABORTED") {
          showToast(
            "Network error. Please check your connection and try again.",
            {
              backgroundColor: error_color,
            }
          );
        } else if (error.response?.status === 401) {
          showToast("Invalid email or password", {
            backgroundColor: error_color,
          });
        } else if (error.response?.data?.message) {
          showToast(error.response.data.message, {
            backgroundColor: error_color,
          });
        } else {
          showToast("Login failed. Please try again.", {
            backgroundColor: error_color,
          });
        }
      } else {
        showToast("An unexpected error occurred. Please try again.", {
          backgroundColor: error_color,
        });
      }
    },
  });

  const onSubmit = (data: form_schema_types) => {
    Keyboard.dismiss();
    mutation.mutate(data);
  };

  if (token !== null) {
    if (user?.role === "ADMIN") {
      return <Redirect href={"/(admin)/dashboard"} />;
    } else {
      return <Redirect href="/(manager)/dashboard" />;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isDarkMode ? ["#181c24", "#23272f"] : ["#e0e7ef", "#f8fafc"]}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.formCardWrapper}>
                <View style={styles.inputsContainer}>
                  <View style={styles.logoContainer}>
                    <Image
                      source={require("@/assets/images/icon.png")}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  <NBTextInput
                    form={form}
                    name="email"
                    placeholder="Enter your email"
                    icon={
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={20}
                        color={isDarkMode ? "#b0b8c9" : "#666666"}
                      />
                    }
                    type="text"
                  />
                  <NBTextInput
                    form={form}
                    name="password"
                    placeholder="Enter your password"
                    icon={
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={20}
                        color={isDarkMode ? "#b0b8c9" : "#666666"}
                      />
                    }
                    type="password"
                  />
                  <NBButton
                    onPress={handleSubmit(onSubmit)}
                    isPending={mutation.isPending}
                    text="Sign In"
                    style={styles.signInButton}
                    textStyle={styles.signInButtonText}
                  />
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;
