import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { error_color, primary_color, success_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React from "react";
import { storage } from "@/utils/storage";
import { logger } from "@/utils/logger";
import { useForm } from "react-hook-form";
import {
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof form_schema>;

export default function ProfileSetup() {
  const { user, isFetching } = useAuth();
  const router = useRouter();
  const query_client = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000" : "#fff",
    },
    header: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "flex-end",
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#333" : "#eee",
    },
    logoutButton: {
      backgroundColor: error_color,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    logoutText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    content: {
      padding: 20,
      alignItems: "center",
    },
    imageContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      overflow: "hidden",
      marginBottom: 30,
    },
    profileImage: {
      width: "100%",
      height: "100%",
    },
    form: {
      width: "100%",
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 8,
      color: isDarkMode ? "#fff" : "#000",
    },
    input: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
      padding: 15,
      borderRadius: 8,
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#000",
    },
    submitButton: {
      backgroundColor: primary_color,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const handleSubmit = (data: FormValues) => {
    mutate(data);
    // Handle form submission
  };

  const { mutate } = useMutation({
    mutationFn: async (data: FormValues) => {
      let body = {};
      if (data.password && data.password.length > 0) {
        body = {
          name: data.name,
          email: data.email,
          password: data.password,
        };
      } else {
        body = {
          name: data.name,
          email: data.email,
        };
      }

      const response = await axios.put(
        `/api/v1/auth/update-user/${user?.id}`,
        body
      );
      return response.data;
    },
    async onSuccess(data, variables, context) {
      try {
        const tokenStored = await storage.setItem("token", data.token);
        if (!tokenStored) {
          throw new Error("Failed to store updated token");
        }

        await query_client.invalidateQueries({
          queryKey: ["token"],
        });

        Toast.show(data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          backgroundColor: success_color,
        });

        logger.auth("Profile updated successfully");
      } catch (error) {
        logger.error("Error updating profile", error);
        Toast.show(
          "Profile updated but there was an issue with token storage",
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: error_color,
          }
        );
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
  const { mutate: logout_mutate } = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      const response = await axios.put(
        `/api/v1/auth/update-user-status/${user?.id}`,
        data
      );

      return response.data;
    },
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            logger.auth("Logout initiated");

            // Handle logout logic here
            const tokenRemoved = await storage.removeItem("token");
            if (!tokenRemoved) {
              logger.warn("Failed to remove token from storage");
            }

            // Invalidate the token query to clear auth state
            await query_client.invalidateQueries({
              queryKey: ["token"],
            });

            // Clear all queries to reset app state
            query_client.clear();

            // Update user status to inactive
            logout_mutate({ isActive: false });

            // Use replace instead of navigate to prevent going back
            router.replace("/login");
            logger.auth("Logout completed");
          } catch (error) {
            logger.error("Logout error", error);
            // Still navigate to login even if there's an error
            router.replace("/login");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={async () => {
              await query_client.invalidateQueries({
                queryKey: ["token"],
              });
            }}
          />
        }
      >
        <View style={dynamicStyles.header}></View>
        <View style={dynamicStyles.content}>
          <View style={dynamicStyles.imageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              style={dynamicStyles.profileImage}
            />
          </View>
          <View style={dynamicStyles.form}>
            <NBTextInput
              name="name"
              type="text"
              form={form}
              placeholder="Enter your name"
              icon={<Feather name="user" size={20} color="#666" />}
            />
            <NBTextInput
              name="email"
              type="text"
              form={form}
              placeholder="Enter your email"
              icon={<Feather name="mail" size={20} color="#666" />}
            />
            <NBTextInput
              name="password"
              type="password"
              form={form}
              placeholder="Enter your password"
              icon={<Feather name="lock" size={20} color="#666" />}
            />
            <NBButton
              text="Update Profile"
              onPress={form.handleSubmit(handleSubmit)}
              isPending={form.formState.isSubmitting}
              // isDisabled={!form.formState.isDirty}
            />
            <TouchableOpacity
              style={dynamicStyles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={dynamicStyles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});
