import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="add_task/index"
        options={{ headerTitle: "Add Task" }}
      />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
