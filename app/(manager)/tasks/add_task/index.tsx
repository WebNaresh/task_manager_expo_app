import AddTaskForm from "@/components/task/add_task/comp";
import TaskCreateScreenSkeleton from "@/components/task/add_task/task-skeleton";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";

interface Task {
  id: string;
  name: string;
  description: string;
}

interface PriorityData {
  id: string;
  name: string;
  number: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export default function ManagerTaskCreateScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { data: tasklists, isFetching: isTaskListFetching } = useQuery({
    queryKey: ["tasklist"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/tasklist");
      return response.data as Task[];
    },
    initialData: [],
  });

  const { user } = useAuth();

  const { data: clients, isFetching: isClientFetching } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/client");
      return response.data;
    },
    initialData: [],
  });

  // For managers, we'll use their own data instead of fetching all managers
  const { data: managers, isFetching: isManagerFetching } = useQuery({
    queryKey: ["current-manager"],
    queryFn: async () => {
      // Return current user as the only manager option
      return [user];
    },
    initialData: [],
    enabled: !!user?.id,
  });

  const { data: priorities, isLoading: isPriorityFetching } = useQuery<
    PriorityData[]
  >({
    queryKey: ["priority"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/priority");
      return response.data;
    },
    initialData: [],
  });

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {(isClientFetching ||
        isManagerFetching ||
        isTaskListFetching ||
        isPriorityFetching) &&
      user?.id ? (
        <TaskCreateScreenSkeleton />
      ) : (
        <AddTaskForm
          clients={clients}
          managers={managers}
          tasklists={tasklists}
          priorities={priorities}
          assignedById={user?.id!}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#000",
  },
});
