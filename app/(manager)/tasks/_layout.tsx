import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[task_id]/index" options={{ title: "Task Detail" }} />
      {/* modal */}
      <Stack.Screen
        name="[task_id]/[user_id]/remark_modal"
        options={{
          presentation: "transparentModal",
          animation: "none", // Disable popping animation
          animationTypeForReplace: "push", // Ensure no popping animation
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[task_id]/[user_id]/[task_list_id]/status_modal"
        options={{
          presentation: "transparentModal",
          animation: "none", // Disable popping animation
          animationTypeForReplace: "push", // Ensure no popping animation
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
