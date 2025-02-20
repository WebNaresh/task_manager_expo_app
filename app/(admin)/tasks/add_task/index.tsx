import AddTaskForm from "@/components/task/add_task/comp";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { z } from "zod";

const form_schema = z.object({
  task_title: z
    .string()
    .trim()
    .min(3, { message: "Task title must be at least 3 characters long" }),
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters long" }),
  tasklist: z
    .string()
    .trim()
    .min(3, { message: "Tasklist must be at least 3 characters long" }),
  assigned_rm: z
    .string()
    .trim()
    .min(3, { message: "Assigned RM must be at least 3 characters long" }),
  due_date: z
    .string()
    .trim()
    .min(3, { message: "Due date must be at least 3 characters long" }),
  client: z
    .string()
    .trim()
    .min(3, { message: "Client must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

export default function TaskCreateScreen() {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState("KYC Approval");
  const [assignedRM, setAssignedRM] = useState("Sarah Chen");
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateTask = () => {
    // Handle task creation logic here
    console.log({
      taskTitle,
      description,
      selectedTask,
      assignedRM,
      dueDate,
      selectedClient,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <AddTaskForm />
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
