import { primary_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export interface Task {
  id: string;
  name: string;
  description: string;
}

export default function TaskManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["tasklist"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/tasklist");
      return response.data as Task[];
    },
    initialData: [],
  });

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter(
      (task: Task) =>
        task.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Search Header */}
      <View
        style={[
          styles.searchContainer,
          isDarkMode && styles.darkSearchContainer,
        ]}
      >
        <View
          style={[
            styles.searchInputContainer,
            isDarkMode && styles.darkSearchInputContainer,
          ]}
        >
          <Feather
            name="search"
            size={20}
            color={isDarkMode ? "#ccc" : "#666"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            placeholder="Search tasks by name or description..."
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Feather
                name="x"
                size={18}
                color={isDarkMode ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.taskList}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {filteredTasks.map((task) => (
          <View
            key={task.id}
            style={[styles.taskItem, isDarkMode && styles.darkTaskItem]}
          >
            <View style={styles.taskContent}>
              <Text
                style={[styles.taskTitle, isDarkMode && styles.darkTaskTitle]}
              >
                {task.name}
              </Text>
              <Text
                style={[
                  styles.taskDescription,
                  isDarkMode && styles.darkTaskDescription,
                ]}
              >
                {task.description}
              </Text>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/dashboard/tasklist/[task_list_id]",
                    params: { task_list_id: task.id },
                  });
                }}
                style={styles.actionButton}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color={isDarkMode ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Link href={"/add_tasklist_modal"} asChild>
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
  darkContainer: {
    backgroundColor: "#000",
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
  darkTaskItem: {
    borderBottomColor: "#333",
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
  darkTaskTitle: {
    color: "#fff",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  darkTaskDescription: {
    color: "#ccc",
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  darkSearchContainer: {
    backgroundColor: "#000",
    borderBottomColor: "#333",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  darkSearchInputContainer: {
    backgroundColor: "#1a1a1a",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 4,
  },
  darkSearchInput: {
    color: "#fff",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});
