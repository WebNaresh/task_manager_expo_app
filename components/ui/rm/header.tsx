import Colors from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Redirect } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";

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
      ]}
    >
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
          ]}
        >
          Welcome back, {user?.name}
        </Text>
      </View>
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG5CPz89vwuDB4H5EsXhkpKz0_koS-0HK0Yg&s",
        }}
        style={styles.avatar}
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
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 16,
  },
  darkMode: {
    backgroundColor: "#121212",
    borderBottomColor: "#333",
  },
  darkModeText: {
    color: "white",
  },
});
