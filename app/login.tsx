import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import showToast from "@/components/ui/toast";
import { error_color, primary_color, success_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod"; // Add this import
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { storage } from "@/utils/storage";
import { alternativeStorage } from "@/utils/alternativeStorage";
import { logger } from "@/utils/logger";
import { validateToken } from "@/utils/tokenUtils";
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
// @ts-ignore
const isDevelopment = process.env.NODE_ENV !== "production";
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isNavigatingAfterLogin, setIsNavigatingAfterLogin] = useState(false);

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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingContent: {
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: 20,
      textAlign: "center",
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
      logger.auth("Login attempt", { email: data.email });
      const response = await axios.post("/api/v1/auth/login", data);
      logger.auth("Login response received", { role: response.data.role });
      return response.data;
    },
    async onSuccess(data, _variables, _context) {
      logger.auth("Login success", { role: data.role, name: data.name });

      // Check authorization first before proceeding
      if (data.role !== "RM" && data.role !== "ADMIN") {
        setIsLoggingIn(false);
        logger.auth("Unauthorized role", data.role);
        showToast("You are not authorized to login", {
          backgroundColor: error_color,
        });
        return;
      }

      try {
        logger.auth("Starting login success handler", {
          platform: Platform.OS,
        });

        // Validate token before storing
        const tokenValidation = validateToken(data.token);
        if (!tokenValidation.isValid) {
          throw new Error(`Invalid token received: ${tokenValidation.reason}`);
        }
        logger.auth("Token validation passed");

        // Get storage diagnostics for production debugging
        const storageDiagnostics = await storage.getDiagnostics();
        logger.auth("Storage diagnostics", storageDiagnostics);

        // Store token using enhanced storage utility with production-specific handling
        logger.auth("Attempting to store token...");

        // Try multiple storage approaches for maximum reliability
        let tokenStored = false;
        let storageMethod = "unknown";

        try {
          // Method 1: Enhanced storage utility
          tokenStored = await storage.setItem("token", data.token);
          if (tokenStored) {
            storageMethod = "enhanced_storage";
            logger.auth("Token stored via enhanced storage");
          }
        } catch (error) {
          logger.error("Enhanced storage failed", error);
        }

        // Method 2: Direct AsyncStorage as fallback
        if (!tokenStored) {
          try {
            const AsyncStorage =
              require("@react-native-async-storage/async-storage").default;
            await AsyncStorage.setItem("token", data.token);
            const directVerify = await AsyncStorage.getItem("token");
            if (directVerify === data.token) {
              tokenStored = true;
              storageMethod = "direct_async_storage";
              logger.auth("Token stored via direct AsyncStorage");
            }
          } catch (error) {
            logger.error("Direct AsyncStorage failed", error);
          }
        }

        // Method 3: Alternative storage system
        if (!tokenStored) {
          try {
            await alternativeStorage.setItem("token", data.token);
            const altVerify = await alternativeStorage.getItem("token");
            if (altVerify === data.token) {
              tokenStored = true;
              storageMethod = "alternative_storage";
              logger.auth("Token stored via alternative storage");
            }
          } catch (error) {
            logger.error("Alternative storage failed", error);
          }
        }

        // Method 4: Force fallback storage
        if (!tokenStored) {
          try {
            // Manually set in fallback storage
            storage.getFallbackKeys(); // Initialize if needed
            await storage.setItem("token", data.token); // This will use fallback
            storageMethod = "fallback_only";
            tokenStored = true;
            logger.auth("Token stored via fallback storage only");
          } catch (error) {
            logger.error("Fallback storage failed", error);
          }
        }

        if (!tokenStored) {
          throw new Error("All token storage methods failed");
        }

        // Verify token was stored by attempting to retrieve it from multiple sources
        let verifyToken = await storage.getItem("token");

        // If primary storage verification fails, try alternative storage
        if (!verifyToken || verifyToken !== data.token) {
          try {
            verifyToken = await alternativeStorage.getItem("token");
            if (verifyToken === data.token) {
              logger.auth("Token verified via alternative storage");
            }
          } catch (error) {
            logger.warn("Alternative storage verification failed", error);
          }
        }

        if (!verifyToken || verifyToken !== data.token) {
          throw new Error(
            `Token storage verification failed in all storages. Expected: ${data.token.substring(
              0,
              20
            )}..., Got: ${verifyToken?.substring(0, 20) || "null"}...`
          );
        }
        logger.auth("Token storage verified successfully", {
          method: storageMethod,
        });

        // Invalidate queries to refresh auth state BEFORE navigation
        await queryClient.invalidateQueries({
          queryKey: ["token"],
        });
        logger.auth("Queries invalidated");

        // Wait longer for auth state to settle in production builds
        const settleDelay = isDevelopment ? 200 : 500;
        await new Promise((resolve) => setTimeout(resolve, settleDelay));
        logger.auth("Auth state settled");

        // Update user status
        mutate({ isActive: true });

        // Show welcome message
        showToast(`Welcome, ${data?.name}`, {
          backgroundColor: success_color,
        });

        // Navigate based on role with additional validation
        const targetRoute =
          data.role === "RM" ? "/(manager)/dashboard" : "/(admin)/dashboard";
        logger.auth("Preparing navigation to dashboard", {
          targetRoute,
          platform: Platform.OS,
        });

        // Set navigation flag to prevent component-level redirects
        setIsNavigatingAfterLogin(true);
        setIsLoggingIn(false);

        // Use longer timeout for production builds to ensure state updates complete
        const navigationDelay = isDevelopment ? 100 : 300;
        setTimeout(() => {
          logger.auth("Executing navigation", targetRoute);
          router.replace(targetRoute);

          // Reset navigation flag after a longer delay in production
          const resetDelay = isDevelopment ? 1000 : 2000;
          setTimeout(() => {
            setIsNavigatingAfterLogin(false);
            logger.auth("Navigation completed and flag reset");
          }, resetDelay);
        }, navigationDelay);
      } catch (error) {
        logger.error("Error in login success handler", error);
        setIsLoggingIn(false);
        setIsNavigatingAfterLogin(false);

        // Try to clean up any partial state
        await storage.removeItem("token");

        showToast(
          "Login successful but there was an issue. Please try again.",
          {
            backgroundColor: error_color,
          }
        );
      }
    },
    onError(error, _variables, _context) {
      logger.error("Login error", error);
      setIsLoggingIn(false);
      setIsNavigatingAfterLogin(false);

      if (axios.isAxiosError(error)) {
        if (error.code === "NETWORK_ERROR" || error.code === "ECONNABORTED") {
          logger.auth("Network error during login");
          showToast(
            "Network error. Please check your connection and try again.",
            {
              backgroundColor: error_color,
            }
          );
        } else if (error.response?.status === 401) {
          logger.auth("Invalid credentials");
          showToast("Invalid email or password", {
            backgroundColor: error_color,
          });
        } else if (error.response?.data?.message) {
          logger.auth("Server error", error.response.data.message);
          showToast(error.response.data.message, {
            backgroundColor: error_color,
          });
        } else {
          logger.auth("Unknown axios error");
          showToast("Login failed. Please try again.", {
            backgroundColor: error_color,
          });
        }
      } else {
        logger.auth("Unexpected error", error);
        showToast("An unexpected error occurred. Please try again.", {
          backgroundColor: error_color,
        });
      }
    },
  });

  const onSubmit = (data: form_schema_types) => {
    Keyboard.dismiss();
    setIsLoggingIn(true);
    logger.auth("Form submitted", { email: data.email });
    mutation.mutate(data);
  };

  // Enhanced redirect logic with better validation
  // Only redirect if we have a valid token, we're not logging in, and mutation is not pending
  // Also ensure we're not in the middle of a login process that will handle navigation
  if (
    token !== null &&
    !isLoggingIn &&
    !mutation.isPending &&
    !mutation.isSuccess &&
    !isNavigatingAfterLogin
  ) {
    logger.auth("Checking existing authentication", {
      hasUser: !!user,
      role: user?.role,
    });

    if (user?.role === "ADMIN") {
      logger.auth("Redirecting to admin dashboard");
      return <Redirect href={"/(admin)/dashboard"} />;
    } else if (user?.role === "RM") {
      logger.auth("Redirecting to manager dashboard");
      return <Redirect href="/(manager)/dashboard" />;
    } else if (token && !user) {
      // Token exists but user couldn't be decoded - likely invalid token
      logger.auth("Token exists but user invalid, clearing token");
      storage.removeItem("token");
    }
  }

  // Show loading screen during login process or navigation
  if (isLoggingIn || mutation.isPending || isNavigatingAfterLogin) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={isDarkMode ? ["#181c24", "#23272f"] : ["#e0e7ef", "#f8fafc"]}
          style={styles.gradientBackground}
        >
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={[
                  styles.loadingText,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Signing you in...
              </Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
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
