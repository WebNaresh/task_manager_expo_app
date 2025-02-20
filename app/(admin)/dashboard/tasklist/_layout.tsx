import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="add_task/index" />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
