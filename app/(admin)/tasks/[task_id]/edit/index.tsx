import { PriorityData } from "@/app/(admin)/dashboard";
import { Task } from "@/app/(admin)/dashboard/tasklist";
import TaskCreateScreenSkeleton from "@/components/task/add_task/task-skeleton";
import EditTaskForm from "@/components/task/edit_task/comp";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const EditTask = () => {
  const { task_id: taskId } = useLocalSearchParams<{ task_id: string }>();
  const {
    data: task,
    isFetching: loading,
    error,
    refetch: retry,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/task/${taskId}`);
      return response.data;
    },
    enabled: !!taskId,
  });

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

  const { data, isFetching: isManagerFetching } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/admin/rms");
      return response.data;
    },
    initialData: [],
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

  if (
    loading ||
    isClientFetching ||
    isManagerFetching ||
    isTaskListFetching ||
    isPriorityFetching
  ) {
    return <TaskCreateScreenSkeleton />;
  }
  return (
    <View style={styles.container}>
      <EditTaskForm
        clients={clients}
        managers={data}
        tasklists={tasklists}
        priorities={priorities}
        task={task}
      />
    </View>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
