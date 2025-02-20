import AddTaskForm from "@/components/task/add_task/comp";
import TaskCreateScreenSkeleton from "@/components/task/add_task/task-skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ScrollView, StyleSheet, Task } from "react-native";

export default function TaskCreateScreen() {
  const { data: tasklists, isFetching: isTaskListFetching } = useQuery({
    queryKey: ["tasklist"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/tasklist");
      return response.data as Task[];
    },
    initialData: [],
  });

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
  return (
    <ScrollView style={styles.container}>
      {isClientFetching || isManagerFetching || isTaskListFetching ? (
        <TaskCreateScreenSkeleton />
      ) : (
        <AddTaskForm clients={clients} managers={data} tasklists={tasklists} />
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
});
