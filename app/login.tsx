import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { error_color, primary_color, success_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod"; // Add this import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const { width } = Dimensions.get("window");

const form_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type form_schema_types = z.infer<typeof form_schema>;

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#181c24" : "#FFFFFF",
    },
    gradientBackground: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 32,
    },
    logoWrapper: {
      position: "absolute",
      top: -60,
      alignSelf: "center",
      zIndex: 2,
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: isDarkMode ? "#23272f" : "#fff",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 2,
      borderColor: isDarkMode ? "#23272f" : "#e0e7ef",
    },
    logo: {
      width: 80,
      height: 80,
      resizeMode: "contain",
      borderRadius: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#1a1a1a",
      marginBottom: 8,
      textAlign: "center",
      marginTop: 60,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? "#b0b8c9" : "#666",
      marginBottom: 0,
      textAlign: "center",
      fontWeight: "400",
    },
    formCardWrapper: {
      width: "100%",
      alignItems: "center",
      marginTop: 32,
      paddingHorizontal: 16,
    },
    formCard: {
      width: "100%",
      maxWidth: 400,
      borderRadius: 16,
      padding: 28,
      backgroundColor: isDarkMode
        ? "rgba(24,28,36,0.7)"
        : "rgba(255,255,255,0.7)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
      alignItems: "center",
      marginTop: 60,
    },
    inputsContainer: {
      width: "100%",
      gap: 18,
      marginBottom: 24,
    },
    signInButton: {
      width: "100%",
      borderRadius: 12,
      paddingVertical: 16,
      marginBottom: 12,
      backgroundColor: primary_color,
      shadowColor: primary_color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    signInButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
      letterSpacing: 0.5,
    },
    forgotPassword: {
      color: isDarkMode ? "#b0b8c9" : primary_color,
      fontSize: 15,
      textAlign: "center",
      marginTop: 4,
      textDecorationLine: "underline",
      opacity: 0.85,
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
      await queryClient.invalidateQueries({
        queryKey: ["token"],
      });
      const response = await axios.post("/api/v1/auth/login", data);
      return response.data;
    },
    async onSuccess(data, _variables, _context) {
      Toast.show(`Welcome, ${data?.name}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });

      if (data.role === "RM") {
        await AsyncStorage.setItem("token", data.token);
        await queryClient.invalidateQueries({
          queryKey: ["token"],
        });
        router.push("/(manager)/dashboard");
      } else if (data.role === "ADMIN") {
        router.push("/(admin)/dashboard");
        await AsyncStorage.setItem("token", data.token);
        await queryClient.invalidateQueries({
          queryKey: ["token"],
        });
      }

      mutate({ isActive: true });

      // if data role is other than RM or ADMIN
      if (data.role !== "RM" && data.role !== "ADMIN") {
        Toast.show("You are not authorized to login", {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          backgroundColor: error_color,
        });
      }
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error)) {
        Toast.show(error.response?.data.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          backgroundColor: error_color,
        });
      }
    },
  });

  const onSubmit = (data: form_schema_types) => {
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
        colors={isDarkMode ? ["#181c24", "#23272f"] : ["#f8fafc", "#e0e7ef"]}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <View style={styles.formCardWrapper}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.logo}
                  />
                </View>
                <BlurView
                  intensity={60}
                  tint={isDarkMode ? "dark" : "light"}
                  style={styles.formCard}
                >
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>
                    Sign in to your Glory Prime Wealth account
                  </Text>
                  <View style={styles.inputsContainer}>
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
                  </View>
                  <NBButton
                    onPress={handleSubmit(onSubmit)}
                    isPending={mutation.isPending}
                    text="Sign In"
                    style={styles.signInButton}
                    textStyle={styles.signInButtonText}
                  />
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </BlurView>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;
