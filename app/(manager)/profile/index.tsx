import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileSetup() {
  const [rmName, setRmName] = useState("");
  const [rmDesignation, setRmDesignation] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    // Handle form submission
    console.log({ rmName, rmDesignation });
  };

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>User Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter User Name"
              placeholderTextColor="#999"
              value={rmName}
              onChangeText={setRmName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RM Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter RM Email"
              placeholderTextColor="#999"
              value={rmDesignation}
              onChangeText={setRmDesignation}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  logoutText: {
    color: "#dc2626",
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
    backgroundColor: "#6366f1",
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
});
