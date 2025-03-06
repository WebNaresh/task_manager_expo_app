"use client";

import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Toast from "react-native-root-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignedById: string;
  responsibleUserId: string;
  clientId: string;
  taskListId: string;
  priorityId: string;
  createdAt: string;
  updatedAt: string;
  priority: {
    id: string;
    number: number;
    color: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  responsibleUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    disabled: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  taskList: {
    id: string;
    name: string;
    description: string;
    is_visible_to_rm: boolean;
    createdAt: string;
    updatedAt: string;
  };
  taskListChanges: TaskListChange[];
}

interface TaskListChange {
  id: string;
  description: string;
  changedAt: string;
  type: "TASKLIST_CHANGE" | "REMARK_CHANGE";
}

const TaskDetailScreen: React.FC = () => {
  const { task_id: taskId } = useLocalSearchParams<{ task_id: string }>();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
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

  const { mutate } = useMutation({
    mutationFn: async (status: "PENDING" | "COMPLETED") => {
      // axios put /api/v1/task/{id}/complete

      const response = await axios.put(`/api/v1/task/${taskId}/complete`, {
        status,
      });
      return response.data;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      Toast.show("Task updated successfully", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: success_color,
      });
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error)) {
        console.error(`🚀 ~ error.response.data:`, error?.response?.data);
        Toast.show(error?.response?.data?.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: error_color,
        });
      }
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <TaskDetailSkeleton />;
  }

  if (error) {
    return (
      <View
        style={[styles.errorContainer, isDarkMode && styles.errorContainerDark]}
      >
        <Text style={[styles.errorText, isDarkMode && styles.errorTextDark]}>
          Something went wrong
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => retry()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!task) {
    return (
      <Text style={[styles.noTaskText, isDarkMode && styles.noTaskTextDark]}>
        No task data available.
      </Text>
    );
  }

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          {task.title}
        </Text>
        <View
          style={[
            styles.statusTag,
            {
              backgroundColor:
                task.status === "PENDING"
                  ? isDarkMode
                    ? "#4A4A4A"
                    : "#FFF9E7"
                  : isDarkMode
                  ? "#2E7D32"
                  : "#E8F5E9",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: task.status === "PENDING" ? "#FFB800" : "#4CAF50" },
            ]}
          >
            {task.status.toLowerCase()}
          </Text>
        </View>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text
          style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
        >
          Description
        </Text>
        <Text
          style={[styles.description, isDarkMode && styles.descriptionDark]}
        >
          {task.description}
        </Text>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text
          style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
        >
          Priority
        </Text>
        <View
          style={[styles.priorityTag, { backgroundColor: task.priority.color }]}
        >
          <Text style={styles.priorityText}>{task.priority.name}</Text>
        </View>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text
          style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
        >
          Due Date
        </Text>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color="#666" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            {formatDate(task.dueDate)}
          </Text>
        </View>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text
          style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
        >
          Responsible User
        </Text>
        <View style={styles.infoRow}>
          <Feather name="user" size={16} color="#666" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            {task.responsibleUser.name}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="mail" size={16} color="#666" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            {task.responsibleUser.email}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="briefcase" size={16} color="#666" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            {task.responsibleUser.role}
          </Text>
        </View>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text
          style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
        >
          Task List
        </Text>
        <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
          {task.taskList.name}
        </Text>
        <Text
          style={[styles.description, isDarkMode && styles.descriptionDark]}
        >
          {task.taskList.description}
        </Text>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text
          style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
        >
          Additional Information
        </Text>
        <View style={styles.infoRow}>
          <Feather name="hash" size={16} color="#666" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            Task ID: {task.id}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color="#666" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            Created: {formatDate(task.createdAt)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="edit" size={16} color="#666" />
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            Updated: {formatDate(task.updatedAt)}
          </Text>
        </View>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text
          style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
        >
          Task List Changes
        </Text>
        {task.taskListChanges.map((change: any) => (
          <View key={change.id} style={styles.changeItem}>
            <Text
              style={[
                styles.changeDescription,
                isDarkMode && styles.changeDescriptionDark,
              ]}
            >
              {change.description}
            </Text>
            <Text
              style={[styles.changeInfo, isDarkMode && styles.changeInfoDark]}
            >
              {change.type} - {new Date(change.changedAt).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => {
            // Navigate to the edit task screen
            router.push({
              pathname: "/tasks/[task_id]/edit",
              params: { task_id: taskId },
            });
          }}
          style={[styles.button, styles.editButton]}
        >
          <Feather name="edit-2" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // Navigate to the delete task screen
            router.push({
              pathname: "/tasks/[task_id]/delete",
              params: { task_id: taskId },
            });
          }}
          style={[styles.button, { backgroundColor: "#FF5252" }]}
        >
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete Task</Text>
        </TouchableOpacity>

        {task?.status === "PENDING" ? (
          <TouchableOpacity
            onPress={() => {
              mutate("COMPLETED");
            }}
            style={[styles.button, styles.completeButton]}
          >
            <Feather name="check" size={20} color="#fff" />
            <Text style={styles.buttonText}>Complete Task</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              mutate("PENDING");
            }}
            style={[styles.button, styles.pendingButton]}
          >
            <Feather name="x" size={20} color="#fff" />
            <Text style={styles.buttonText}>Make it Pending</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const TaskDetailSkeleton: React.FC = () => {
  const [fadeAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const SkeletonItem = ({
    width,
    height,
    style,
  }: {
    width: string | number;
    height: number;
    style?: object;
  }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#E0E0E0",
          borderRadius: 4,
          opacity: fadeAnim,
        },
        style,
      ]}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <SkeletonItem width="80%" height={30} />
        <SkeletonItem width={100} height={24} style={{ marginTop: 10 }} />
      </View>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={[styles.section, { marginTop: 10 }]}>
          <SkeletonItem width="60%" height={20} />
          <SkeletonItem width="100%" height={60} style={{ marginTop: 10 }} />
        </View>
      ))}
      <View style={[styles.actionButtons, { marginTop: 20 }]}>
        <SkeletonItem width="45%" height={50} style={{ borderRadius: 8 }} />
        <SkeletonItem width="45%" height={50} style={{ borderRadius: 8 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerDark: {
    backgroundColor: "#1E1E1E",
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  titleDark: {
    color: "#fff",
  },
  statusTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  sectionDark: {
    backgroundColor: "#1E1E1E",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  sectionTitleDark: {
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  descriptionDark: {
    color: "#ccc",
  },
  priorityTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  infoTextDark: {
    color: "#ccc",
  },
  actionButtons: {
    padding: 20,
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  completeButton: {
    backgroundColor: success_color,
  },
  pendingButton: {
    backgroundColor: "#FFB800",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainerDark: {
    backgroundColor: "#121212",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
    textAlign: "center",
    marginBottom: 20,
  },
  errorTextDark: {
    color: "#ff6666",
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noTaskText: {
    fontSize: 16,
    color: "#333",
  },
  noTaskTextDark: {
    color: "#ccc",
  },
  changeItem: {
    marginBottom: 12,
  },
  changeDescription: {
    fontSize: 16,
  },
  changeDescriptionDark: {
    color: "#ccc",
  },
  changeInfo: {
    fontSize: 14,
    color: "#666",
  },
  changeInfoDark: {
    color: "#999",
  },
});

export default TaskDetailScreen;
