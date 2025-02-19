import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="manager/index"
        options={{ title: "Relationship Manager" }}
      />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
