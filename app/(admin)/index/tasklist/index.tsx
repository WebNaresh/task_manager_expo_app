import { primary_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
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
  name: string;
  description: string;
}

export default function TaskManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ["tasklist"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/tasklist");
      return response.data as Task[];
    },
    initialData: [],
  });
  console.log(`🚀 ~ data:`, data);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.taskList}>
        {data.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.name}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </View>
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
      <Link href={"/add_rm_modal"} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
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
  taskContent: {
    flex: 1,
    paddingRight: 16,
  },
  taskTitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: primary_color,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
  },
});
