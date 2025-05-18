import Colors from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Redirect } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function Header(props: BottomTabHeaderProps) {
  const colorScheme = useColorScheme();
  const { user, token } = useAuth();

  if (!token) {
    return <Redirect href={"/login"} />;
  }

  const isDarkMode = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
        isDarkMode && styles.darkMode,
        styles.card,
      ]}
    >
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.clientLogo}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: Colors[colorScheme ?? "light"].text },
            isDarkMode && styles.darkModeText,
          ]}
        >
          {user?.name}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: Colors[colorScheme ?? "light"].text },
            isDarkMode && styles.darkModeText,
            styles.welcomeText,
          ]}
        >
          Welcome back, <Text style={styles.bold}>{user?.name}</Text>
        </Text>
      </View>
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG5CPz89vwuDB4H5EsXhkpKz0_koS-0HK0Yg&s",
        }}
        style={styles.avatar}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: 28,
  },
  card: {
    borderRadius: 18,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        }),
    elevation: 3,
    margin: 12,
    borderWidth: 0,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  welcomeText: {
    fontWeight: "500",
    fontSize: 17,
    opacity: 1,
    marginTop: 2,
  },
  bold: {
    fontWeight: "700",
  },
  clientLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 0,
    backgroundColor: "#f0f0f0",
  },
  darkMode: {
    backgroundColor: "#121212",
    borderBottomColor: "#333",
  },
  darkModeText: {
    color: "white",
  },
});
