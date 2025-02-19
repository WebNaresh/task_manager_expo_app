import { Feather } from "@expo/vector-icons"; // Using Expo icons, but you can use any icon library
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Task {
  id: string;
  title: string;
}

export default function TaskManagement() {
  const tasks: Task[] = [
    { id: "1", title: "KYC approval" },
    { id: "2", title: "Investment Processing" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.taskList}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.taskActions}>
              <TouchableOpacity
                onPress={() => console.log("Edit", task.id)}
                style={styles.actionButton}
              >
                <Feather name="edit-2" size={18} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.log("Delete", task.id)}
                style={styles.actionButton}
              >
                <Feather name="trash-2" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  addButton: {
    color: "#4B6BFB",
    fontSize: 16,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  taskTitle: {
    fontSize: 16,
    color: "#000",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
