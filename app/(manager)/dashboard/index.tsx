import useAuth from "@/hooks/useAuth";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

const { width } = Dimensions.get("window");

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
  iconColor: string;
  icon: string;
  isLoading: boolean;
  theme: ThemeType;
}

interface TaskItemProps {
  task: Task;
  theme: ThemeType;
  onTaskPress: (task: Task) => void;
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

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

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

  // Helper functions for modal
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "IN_PROGRESS":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days left`;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.text}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statusCards}>
            <StatusCard
              title="Total Tasks"
              count={data?.totalTaskCount || "0"}
              backgroundColor="#F8FAFC"
              iconColor="#64748B"
              icon="assignment"
              isLoading={isFetching}
              theme={theme}
            />
            <StatusCard
              title="Pending Updates"
              count={data?.taskWithNoUpdatesCount || "0"}
              backgroundColor="#FFFBEB"
              iconColor="#D97706"
              icon="refresh"
              isLoading={isFetching}
              theme={theme}
            />
          </View>

          {/* Additional Stats Row */}
          <View style={styles.statusCards}>
            <StatusCard
              title="Completed"
              count={data?.completedTaskCount || "0"}
              backgroundColor="#F0FDF4"
              iconColor="#16A34A"
              icon="check-circle"
              isLoading={isFetching}
              theme={theme}
            />
            <StatusCard
              title="In Progress"
              count={data?.inProgressTaskCount || "0"}
              backgroundColor="#F1F5F9"
              iconColor="#3B82F6"
              icon="trending-up"
              isLoading={isFetching}
              theme={theme}
            />
          </View>
        </View>

        {/* Recent Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Tasks
            </Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: "#667eea" }]}>
                View All
              </Text>
              <Feather name="arrow-right" size={16} color="#667eea" />
            </TouchableOpacity>
          </View>

          <View style={styles.tasksList}>
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  theme={theme}
                  onTaskPress={handleTaskPress}
                />
              ))
            ) : (
              <View
                style={[styles.emptyState, { backgroundColor: colors.card }]}
              >
                <Feather name="inbox" size={48} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: colors.secondaryText },
                  ]}
                >
                  No recent tasks found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Task Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {selectedTask && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Task Details
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Feather name="x" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Task Content */}
                <View style={styles.modalBody}>
                  {/* Task Title */}
                  <View style={styles.modalSection}>
                    <Text
                      style={[
                        styles.modalSectionTitle,
                        { color: colors.secondaryText },
                      ]}
                    >
                      TITLE
                    </Text>
                    <Text
                      style={[
                        styles.modalSectionContent,
                        { color: colors.text },
                      ]}
                    >
                      {selectedTask.title || "Untitled Task"}
                    </Text>
                  </View>

                  {/* Task Status */}
                  <View style={styles.modalSection}>
                    <Text
                      style={[
                        styles.modalSectionTitle,
                        { color: colors.secondaryText },
                      ]}
                    >
                      STATUS
                    </Text>
                    <View
                      style={[
                        styles.modalStatusBadge,
                        {
                          backgroundColor: `${getStatusColor(
                            selectedTask.status
                          )}20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalStatusText,
                          { color: getStatusColor(selectedTask.status) },
                        ]}
                      >
                        {selectedTask.status.replace("_", " ")}
                      </Text>
                    </View>
                  </View>

                  {/* Task Description */}
                  <View style={styles.modalSection}>
                    <Text
                      style={[
                        styles.modalSectionTitle,
                        { color: colors.secondaryText },
                      ]}
                    >
                      DESCRIPTION
                    </Text>
                    <Text
                      style={[
                        styles.modalSectionContent,
                        { color: colors.text },
                      ]}
                    >
                      {selectedTask.description || "No description available"}
                    </Text>
                  </View>

                  {/* Task Meta Information */}
                  <View style={styles.modalSection}>
                    <Text
                      style={[
                        styles.modalSectionTitle,
                        { color: colors.secondaryText },
                      ]}
                    >
                      DETAILS
                    </Text>
                    <View style={styles.modalMetaContainer}>
                      <View style={styles.modalMetaItem}>
                        <Feather
                          name="calendar"
                          size={16}
                          color={colors.secondaryText}
                        />
                        <Text
                          style={[styles.modalMetaText, { color: colors.text }]}
                        >
                          Due: {formatDate(selectedTask.dueDate)}
                        </Text>
                      </View>
                      <View style={styles.modalMetaItem}>
                        <Feather
                          name="folder"
                          size={16}
                          color={colors.secondaryText}
                        />
                        <Text
                          style={[styles.modalMetaText, { color: colors.text }]}
                        >
                          List: {selectedTask.taskList?.name || "No list"}
                        </Text>
                      </View>
                      <View style={styles.modalMetaItem}>
                        <Feather
                          name="user"
                          size={16}
                          color={colors.secondaryText}
                        />
                        <Text
                          style={[styles.modalMetaText, { color: colors.text }]}
                        >
                          Assignee: {selectedTask.client?.name || "Unassigned"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Modal Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.modalButtonPrimary,
                      { flex: 1 },
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  backgroundColor,
  iconColor,
  icon,
  isLoading,
  theme,
}) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, fadeAnim, scaleAnim]);

  return (
    <TouchableOpacity
      style={[
        styles.statusCard,
        { backgroundColor: theme === "dark" ? colors.card : backgroundColor },
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.cardContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {isLoading ? (
          <>
            <View
              style={[
                styles.skeletonIcon,
                { backgroundColor: `${iconColor}30` },
              ]}
            />
            <View
              style={[
                styles.skeletonTitle,
                { backgroundColor: `${iconColor}20` },
              ]}
            />
            <View
              style={[
                styles.skeletonCount,
                { backgroundColor: `${iconColor}20` },
              ]}
            />
          </>
        ) : (
          <>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${iconColor}20` },
                ]}
              >
                <MaterialIcons name={icon as any} size={18} color={iconColor} />
              </View>
              <Text style={[styles.statusTitle, { color: colors.text }]}>
                {title}
              </Text>
            </View>
            <Text style={[styles.statusCount, { color: iconColor }]}>
              {count}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const TaskItem: React.FC<TaskItemProps> = ({ task, theme, onTaskPress }) => {
  const colors = themes[theme];

  // Determine status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "IN_PROGRESS":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return "#EF4444"; // High priority - Red
    if (priority <= 4) return "#F59E0B"; // Medium priority - Orange
    return "#10B981"; // Low priority - Green
  };

  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority?.number || 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days left`;
  };

  const handleTaskPress = () => {
    onTaskPress(task);
  };

  return (
    <TouchableOpacity
      style={[styles.taskItem, { backgroundColor: colors.card }]}
      activeOpacity={0.8}
      onPress={handleTaskPress}
    >
      <View style={styles.taskContent}>
        <View
          style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}
        />

        <View style={styles.taskDetails}>
          <View style={styles.taskHeader}>
            <Text
              style={[styles.taskTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {task.title || "Untitled Task"}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${statusColor}15` },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor }]}>
                {task.status.replace("_", " ")}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.taskDescription, { color: colors.secondaryText }]}
            numberOfLines={1}
          >
            {task.description || "No description available"}
          </Text>

          <View style={styles.taskMeta}>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={12} color={colors.secondaryText} />
              <Text style={[styles.metaText, { color: colors.secondaryText }]}>
                {formatDate(task.dueDate)}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Feather name="folder" size={12} color={colors.secondaryText} />
              <Text
                style={[styles.metaText, { color: colors.secondaryText }]}
                numberOfLines={1}
              >
                {task.taskList?.name || "No list"}
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },

  // Welcome Section
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 10,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Stats Section
  statsSection: {
    marginBottom: 30,
  },
  statusCards: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statusCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    flexShrink: 0,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
    flexShrink: 1,
    letterSpacing: 0,
    lineHeight: 18,
    marginBottom: 8,
  },
  statusCount: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 4,
  },

  // Skeleton Styles
  skeletonIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 8,
  },
  skeletonTitle: {
    height: 14,
    width: "60%",
    borderRadius: 7,
    marginBottom: 16,
  },
  skeletonCount: {
    height: 28,
    width: "40%",
    borderRadius: 14,
  },

  // Section Styles
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    letterSpacing: -0.5,
  },

  // Tasks Section
  tasksSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },

  // Empty State
  emptyState: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },

  // Task List Styles
  tasksList: {
    gap: 8,
  },
  taskItem: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  priorityIndicator: {
    width: 4,
    height: "100%",
    borderRadius: 3,
    marginRight: 14,
    minHeight: 55,
  },
  taskDetails: {
    flex: 1,
    paddingRight: 8,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.75,
  },
  taskMeta: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flex: 1,
    maxWidth: "48%",
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  taskRight: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    maxHeight: 400,
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  modalSectionContent: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  modalMetaContainer: {
    gap: 12,
  },
  modalMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalMetaText: {
    fontSize: 14,
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonSecondary: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  modalButtonPrimary: {
    backgroundColor: "#667eea",
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default TaskScreen;
