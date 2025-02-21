import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add_task/index" options={{ headerShown: false }} />
      <Stack.Screen name="[task_id]/index" options={{ title: "Task Detail" }} />
      <Stack.Screen
        name="[task_id]/edit/index"
        options={{ title: "Edit Task" }}
      />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
