import { primary_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import TaskTable from "@/task-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

interface FilterOption {
  id: string;
  label: string;
}

const Tasks: React.FC = () => {
  const { user } = useAuth();

  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      <View style={styles.taskHeader}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <ScrollView
        style={styles.taskList}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
      >
        <TaskTable tasks={data} user_id={user?.id!} />
      </ScrollView>

      <Link href={"/(manager)/tasks/add_task"} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  calendarIcon: {
    marginRight: 4,
  },
  calendarText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f43f5e",
  },

  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8, // Reduced from 16
    flexDirection: "row",
    flexGrow: 0, // Added fixed height
  },

  filterContainerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%", // Ensure content fills container height
  },

  filterChip: {
    paddingHorizontal: 16, // Reduced from 20
    paddingVertical: 8, // Reduced from 12
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    minWidth: 90, // Reduced from 100
    alignSelf: "center", // Changed from flex-start to center
    height: 36, // Added fixed height
    justifyContent: "center", // Center content vertically
  },
  activeFilterChip: {
    backgroundColor: primary_color,
  },
  filterText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
  },
  activeFilterText: {
    color: "#fff",
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 16,
  },

  highPriority: {
    backgroundColor: "#fee2e2",
  },
  assigneeName: {
    fontSize: 16,
    color: "#666",
  },
  pendingPriority: {
    backgroundColor: "#fff2cc",
  },
  lowPriority: {
    backgroundColor: "#d1e7dd",
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  datePickerButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateRangeContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 4,
  },
  datePickerWrapper: {
    position: "relative",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#6366f1",
  },
  activeNavText: {
    color: "#6366f1",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: primary_color,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Tasks;
