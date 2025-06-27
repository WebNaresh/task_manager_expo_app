import { primary_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import TaskTable from "@/task-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("rm_id", user?.id as string);
      const response = await axios.get("/api/v1/task", {
        params,
      });
      return response.data;
    },
    initialData: [],
    enabled: !!user?.id,
  });

  const onRefresh = async () => {
    await refetch();
  };

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.containerDark]}
      >
        <View style={[styles.taskHeader, isDarkMode && styles.taskHeaderDark]}>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            Tasks
          </Text>
        </View>

        <ScrollView
          style={[styles.taskList, isDarkMode && styles.taskListDark]}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onRefresh}
              tintColor={isDarkMode ? "#fff" : "#000"}
              colors={isDarkMode ? ["#fff"] : [primary_color]}
            />
          }
        >
          <TaskTable tasks={data} user_id={user?.id!} />
        </ScrollView>
      </SafeAreaView>

      {/* FAB with reliable positioning */}
      <View style={styles.fabWrapper}>
        <Link href={"/(manager)/tasks/add_task"} asChild>
          <TouchableOpacity
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 20,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: "relative", // Establish positioning context
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  taskHeaderDark: {
    backgroundColor: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },

  taskList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskListDark: {
    backgroundColor: "#000",
  },

  fabWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    pointerEvents: "box-none", // Allow touches to pass through
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 30,
    zIndex: 999999, // Very high z-index
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF", // Blue color as requested
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20, // Maximum elevation
    borderWidth: 2,
    borderColor: "#FFFFFF", // White border
  },
  fabText: {
    color: "#FFFFFF", // White text for gray background
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fabDark: {
    backgroundColor: "#007AFF", // Same blue color for dark mode
    shadowColor: "#fff",
    shadowOpacity: 0.8,
    borderColor: "#FFFFFF", // White border for contrast
    borderWidth: 2, // Consistent border width
    shadowRadius: 12, // Larger glow effect
  },
  fabTextDark: {
    color: "#ffffff", // Black text for better contrast on bright orange
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Tasks;
