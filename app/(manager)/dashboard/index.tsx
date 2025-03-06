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
  useColorScheme,
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
  theme: ThemeType;
}

interface TaskItemProps {
  task: Task;
  theme: ThemeType;
}

// Define theme colors
interface ThemeColors {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  skeleton: string;
}

type ThemeType = "light" | "dark";

const themes: Record<ThemeType, ThemeColors> = {
  light: {
    background: "#F8FAFC",
    card: "white",
    text: "#0F172A",
    secondaryText: "#64748B",
    border: "#E2E8F0",
    skeleton: "rgba(255,255,255,0.3)",
  },
  dark: {
    background: "#000000", // Pure black to match header/footer
    card: "#121212", // Dark card that works with black background
    text: "#FFFFFF",
    secondaryText: "#A0A0A0",
    border: "#2C2C2C",
    skeleton: "rgba(255,255,255,0.2)",
  },
};

const TaskScreen: React.FC = () => {
  const colorScheme = useColorScheme() as ThemeType;
  const theme = colorScheme === "dark" ? "dark" : "light";
  const colors = themes[theme];

  const { user } = useAuth();
  const rm_id = user?.id;

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["manager-stat"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/v1/task/dashboard/statistics/${rm_id}`
      );

      return response.data;
    },
    enabled: !!rm_id,
  });

  const { data: tasks, isFetching: isFetchingTasks } = useQuery({
    queryKey: ["manager-tasks"],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/task/top3tasks/${rm_id}`);

      return response.data;
    },
    initialData: [],
    enabled: !!rm_id,
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={refetch}
          tintColor={colors.text} // Ensure the refresh indicator matches the theme
        />
      }
    >
      <View style={styles.statusCards}>
        <StatusCard
          title="Ongoing Tasks"
          count={data?.totalTaskCount}
          backgroundColor="#A78BFA"
          isLoading={isFetching}
          theme={theme}
        />
        <StatusCard
          title="No-Update Tasks"
          count={data?.taskWithNoUpdatesCount}
          backgroundColor="#4B6BFB"
          isLoading={isFetching}
          theme={theme}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Today's Tasks
      </Text>

      <View style={styles.tasksList}>
        {tasks.map((task: any) => (
          <TaskItem key={task.id} task={task} theme={theme} />
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
  theme,
}) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const colors = themes[theme];

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

const TaskItem: React.FC<TaskItemProps> = ({ task, theme }) => {
  const colors = themes[theme];

  // Determine status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#FF6B6B";
      case "PENDING":
        return "#FF6B6B";
      case "IN_PROGRESS":
        return "#4B6BFB";
      default:
        return "#64748B";
    }
  };

  const statusColor = getStatusColor(task.status);

  return (
    <View style={[styles.taskItem, { backgroundColor: colors.card }]}>
      <View style={styles.taskContent}>
        <View style={styles.dotContainer}>
          <View style={styles.dot} />
        </View>
        <View style={styles.taskDetails}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>
            {task.title}
          </Text>
          <Text
            style={[styles.taskDescription, { color: colors.secondaryText }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
          <Text style={[styles.taskTime, { color: colors.secondaryText }]}>
            {new Date(task.dueDate).toLocaleDateString()}
          </Text>

          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${statusColor}20` },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor }]}>
                {task.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.taskRight}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.avatar}
          />
          <Text style={[styles.assigneeName, { color: colors.secondaryText }]}>
            {task.client.name}
          </Text>
          <Text style={[styles.assigneeMore, { color: colors.secondaryText }]}>
            MORE
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flexDirection: "row",
  },
  dotContainer: {
    paddingTop: 4,
    marginRight: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF0000",
  },
  taskDetails: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 4,
    color: "#64748B",
    lineHeight: 20,
  },
  taskTime: {
    fontSize: 14,
    marginBottom: 8,
  },
  taskRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  assigneeName: {
    fontSize: 12,
    textAlign: "center",
  },
  assigneeMore: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  statusBadgeContainer: {
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});

export default TaskScreen;
