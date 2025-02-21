"use client";

import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
}

const TaskDetailScreen: React.FC = () => {
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => retry()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!task) {
    return <Text>No task data available.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View
          style={[
            styles.statusTag,
            {
              backgroundColor:
                task.status === "PENDING" ? "#FFF9E7" : "#E8F5E9",
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority</Text>
        <View
          style={[styles.priorityTag, { backgroundColor: task.priority.color }]}
        >
          <Text style={styles.priorityText}>{task.priority.name}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Due Date</Text>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>{formatDate(task.dueDate)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Responsible User</Text>
        <View style={styles.infoRow}>
          <Feather name="user" size={16} color="#666" />
          <Text style={styles.infoText}>{task.responsibleUser.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="mail" size={16} color="#666" />
          <Text style={styles.infoText}>{task.responsibleUser.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="briefcase" size={16} color="#666" />
          <Text style={styles.infoText}>{task.responsibleUser.role}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task List</Text>
        <Text style={styles.infoText}>{task.taskList.name}</Text>
        <Text style={styles.description}>{task.taskList.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.infoRow}>
          <Feather name="hash" size={16} color="#666" />
          <Text style={styles.infoText}>Task ID: {task.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color="#666" />
          <Text style={styles.infoText}>
            Created: {formatDate(task.createdAt)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="edit" size={16} color="#666" />
          <Text style={styles.infoText}>
            Updated: {formatDate(task.updatedAt)}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.editButton]}>
          <Feather name="edit-2" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.completeButton]}>
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Mark as Complete</Text>
        </TouchableOpacity>
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
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
    textAlign: "center",
    marginBottom: 20,
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
});

export default TaskDetailScreen;
