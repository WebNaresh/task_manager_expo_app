import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { error_color, primary_color, success_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React from "react";
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

  const handleSubmit = (data: FormValues) => {
    console.log(`🚀 ~ data:`, data);
    mutate(data);
    // Handle form submission
  };

  const { mutate } = useMutation({
    mutationFn: async (data: FormValues) => {
      await query_client.invalidateQueries({
        queryKey: ["token"],
      });
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

      const response = await axios.post(
        `/api/v1/auth/update-user/${user?.id}`,
        body
      );
      return response.data;
    },
    async onSuccess(data, variables, context) {
      console.log(`🚀 ~ data:`, data?.token);
      await AsyncStorage.setItem("token", data.token);

      Toast.show(`Welcome, ${data?.name}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });
      // router.push("/(manager)");
    },
    onError(error, variables, context) {
      console.log(`🚀 ~ error:`, error);
      if (axios.isAxiosError(error)) {
        console.log(`🚀 ~ error.response:`, error.response?.data.message);
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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          // Handle logout logic here
          console.log("User logged out");
          await AsyncStorage.removeItem("token");
          router.navigate("/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.header}></View>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cQfL4nBBRlIcBoOirzokTtE3DcUF3k.png",
              }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.form}>
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
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
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
