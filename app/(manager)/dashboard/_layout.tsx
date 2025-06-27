import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const ManagerDashboardLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ManagerDashboardLayout;

const styles = StyleSheet.create({});
