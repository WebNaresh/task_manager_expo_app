import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignedById: string;
  responsibleUserId: string;
  clientId: string;
  taskListId: string;
  priorityId: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    disabled: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  priority: {
    id: string;
    number: number;
    color: string;
    name: string;
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

interface StatusCardProps {
  title: string;
  count: string;
  backgroundColor: string;
  isLoading: boolean;
}

interface TaskItemProps {
  task: Task;
}

const TaskScreen: React.FC = () => {
  const { user } = useAuth();
  const rm_id = user?.id;

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["manager-stat"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/v1/task/dashboard/statistics/${rm_id}`
      );
      console.log(`🚀 ~ response.data:`, response.data);

      return response.data;
    },
    enabled: !!rm_id,
  });

  const { data: tasks, isFetching: isFetchingTasks } = useQuery({
    queryKey: ["manager-tasks"],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/task/top3tasks/${rm_id}`);
      console.log(`🚀 ~ response.data:`, response.data);

      return response.data;
    },
    initialData: [],
    enabled: !!rm_id,
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
    >
      <View style={styles.statusCards}>
        <StatusCard
          title="Ongoing Tasks"
          count={data?.totalTaskCount}
          backgroundColor="#A78BFA"
          isLoading={isFetching}
        />
        <StatusCard
          title="No-Update Tasks"
          count={data?.taskWithNoUpdatesCount}
          backgroundColor="#4B6BFB"
          isLoading={isFetching}
        />
      </View>

      <Text style={styles.sectionTitle}>Today's Tasks</Text>

      <View style={styles.tasksList}>
        {tasks.map((task: any) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </View>
    </ScrollView>
  );
};

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  backgroundColor,
  isLoading,
}) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [isLoading, fadeAnim]);

  return (
    <View style={[styles.statusCard, { backgroundColor }]}>
      {isLoading ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonCount} />
          <View style={styles.statusLine} />
        </Animated.View>
      ) : (
        <>
          <Text style={styles.statusTitle}>{title}</Text>
          <Text style={styles.statusCount}>{count}</Text>
          <View style={styles.statusLine} />
        </>
      )}
    </View>
  );
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => (
  <View style={styles.taskItem}>
    <View style={styles.taskContent}>
      <View style={styles.dotContainer}>
        <View style={[styles.dot, { backgroundColor: task.priority.color }]} />
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>
        <Text style={styles.taskTime}>
          {new Date(task.dueDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.taskRight}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.avatar}
        />
        <Text style={styles.assigneeName}>{task.client.name}</Text>
      </View>
    </View>
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: `${task.priority.color}20` },
      ]}
    >
      <Text style={[styles.statusText, { color: task.priority.color }]}>
        {task.status}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  statusCards: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statusCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
  },
  statusTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  statusCount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  statusLine: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginTop: 8,
  },
  skeletonTitle: {
    height: 16,
    width: "60%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonCount: {
    height: 32,
    width: "40%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tasksList: {
    gap: 12,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotContainer: {
    width: 24,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FB923C",
  },
  taskDetails: {
    flex: 1,
    marginLeft: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: "#64748B",
  },
  taskRight: {
    alignItems: "center",
    gap: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
  },
  assigneeName: {
    fontSize: 12,
    color: "#64748B",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default TaskScreen;
