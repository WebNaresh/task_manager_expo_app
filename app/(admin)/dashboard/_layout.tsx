import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="manager/index"
        options={{ title: "Relationship Manager's" }}
      />
      <Stack.Screen name="client/index" options={{ title: "Client's" }} />
      <Stack.Screen name="tasklist/index" options={{ title: "Task List" }} />
      <Stack.Screen
        name="tasklist/[task_list_id]/index"
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

export default RootLayout;

const styles = StyleSheet.create({});
