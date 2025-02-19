import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Tasks = () => {
  return (
    <View>
      <Text>Tasks</Text>
      <Link href="/add_task_modal" asChild>
        <Text>Open Modal</Text>
      </Link>
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({});
