import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// Note: LayoutAnimation is automatically enabled in the New Architecture

interface TaskTableProps {
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority?: {
      color: string;
      name: string;
    };
    responsibleUser?: {
      name: string;
    };
    dueDate: string;
    status: string;
    taskList?: {
      name: string;
      id: string;
    };
    client?: {
      name: string;
      status: string;
    };
    user_id?: string;
  }>;
  user_id: string;
}

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Function to determine if a date is overdue
const isOverdue = (dateString: string): boolean => {
  const dueDate = new Date(dateString);
  const today = new Date();
  return (
    dueDate < today && dueDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
  );
};

// Task detail component
interface TaskDetailViewProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: {
      color: string;
      name: string;
    };
    responsibleUser: {
      name: string;
    };
    dueDate: string;
    status: string;
    taskList?: {
      name: string;
      id: string;
    };
    client?: {
      name: string;
      status: string;
    };
  };
  isDarkMode: boolean;
}

const TaskDetailView = ({ task, isDarkMode }: TaskDetailViewProps) => {
  const isTaskOverdue = isOverdue(task.dueDate);

  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? "rgba(30, 34, 42, 0.95)"
          : "rgba(240, 245, 250, 0.95)",
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 12,
          color: isDarkMode ? "#e0e0e0" : "#333",
        }}
      >
        {task.title}
      </Text>

      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: isDarkMode ? "#a0a8b8" : "#546E7A",
            marginBottom: 4,
          }}
        >
          Description
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: isDarkMode ? "#ccc" : "#424242",
            lineHeight: 20,
          }}
        >
          {task.description || "No description provided"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
        <View style={{ marginRight: 24, marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: isDarkMode ? "#a0a8b8" : "#546E7A",
              marginBottom: 4,
            }}
          >
            Priority
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: `${task.priority?.color || "#666"}20`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: task.priority?.color || "#666",
                marginRight: 6,
              }}
            />
            <Text
              style={{
                color: task.priority?.color || "#666",
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {task.priority?.name || "No Priority"}
            </Text>
          </View>
        </View>

        <View style={{ marginRight: 24, marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: isDarkMode ? "#a0a8b8" : "#546E7A",
              marginBottom: 4,
            }}
          >
            Due Date
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isTaskOverdue
                ? isDarkMode
                  ? "#ff6e6e"
                  : "#f44336"
                : isDarkMode
                ? "#ccc"
                : "#424242",
              fontWeight: isTaskOverdue ? "600" : "normal",
            }}
          >
            {isTaskOverdue ? (
              <>
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={isDarkMode ? "#ff6e6e" : "#f44336"}
                />
                {" " + formatDateTime(task.dueDate)}
              </>
            ) : (
              formatDateTime(task.dueDate)
            )}
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: isDarkMode ? "#a0a8b8" : "#546E7A",
              marginBottom: 4,
            }}
          >
            Responsible
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isDarkMode ? "#ccc" : "#424242",
            }}
          >
            {task.responsibleUser?.name || "Unassigned"}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Empty state component
const EmptyState = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
      paddingHorizontal: 20,
    }}
  >
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: isDarkMode
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(59, 130, 246, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <MaterialIcons
        name="assignment"
        size={40}
        color={isDarkMode ? "#60a5fa" : "#3b82f6"}
      />
    </View>
    <Text
      style={{
        fontSize: 18,
        fontWeight: "600",
        color: isDarkMode ? "#e2e8f0" : "#374151",
        marginBottom: 8,
        textAlign: "center",
      }}
    >
      No Tasks Found
    </Text>
    <Text
      style={{
        fontSize: 14,
        color: isDarkMode ? "#94a3b8" : "#6b7280",
        textAlign: "center",
        lineHeight: 20,
      }}
    >
      There are no tasks to display at the moment.{"\n"}
      Tasks will appear here once they are created.
    </Text>
  </View>
);

const TaskTable: React.FC<TaskTableProps> = ({ tasks, user_id }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();
  const [pressedRow, setPressedRow] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // Add safety check for tasks data
  const safeTasks = React.useMemo(() => {
    if (!Array.isArray(tasks)) {
      console.warn("TaskTable: tasks is not an array", tasks);
      return [];
    }

    return tasks.filter((task) => {
      if (!task || typeof task !== "object") {
        console.warn("TaskTable: invalid task object", task);
        return false;
      }
      return true;
    });
  }, [tasks]);
  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({}).current;
  const buttonScaleAnims = useRef<{ [key: string]: Animated.Value }>(
    {}
  ).current;
  const expandAnims = useRef<{
    [key: string]: { height: Animated.Value; opacity: Animated.Value };
  }>({}).current;

  // Initialize animation values for each task
  React.useEffect(() => {
    tasks.forEach((task) => {
      if (!scaleAnims[task.id]) {
        scaleAnims[task.id] = new Animated.Value(1);
      }
      if (!expandAnims[task.id]) {
        expandAnims[task.id] = {
          height: new Animated.Value(0),
          opacity: new Animated.Value(0),
        };
      }
    });
  }, [tasks]);

  const animateExpand = (taskId: string, expanding: boolean) => {
    const config = {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    };

    Animated.parallel([
      Animated.timing(expandAnims[taskId].height, {
        toValue: expanding ? 1 : 0,
        ...config,
      }),
      Animated.timing(expandAnims[taskId].opacity, {
        toValue: expanding ? 1 : 0,
        ...config,
      }),
    ]).start();
  };

  const openTaskModal = (task: any) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsModalVisible(false);
  };

  const handleRowPress = (task: any) => {
    setPressedRow(task.id);

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnims[task.id], {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(scaleAnims[task.id], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start(() => {
      setPressedRow(null);
      openTaskModal(task);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return isDarkMode ? "#0D5D56" : "#00BFA5";
      case "IN_PROGRESS":
        return isDarkMode ? "#00578e" : "#0288D1";
      case "PENDING":
        return isDarkMode ? "#5D4D10" : "#FFA000";
      default:
        return isDarkMode ? "#485563" : "#78909C";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return isDarkMode ? "rgba(13, 93, 86, 0.2)" : "rgba(0, 191, 165, 0.1)";
      case "IN_PROGRESS":
        return isDarkMode ? "rgba(0, 87, 142, 0.2)" : "rgba(2, 136, 209, 0.1)";
      case "PENDING":
        return isDarkMode ? "rgba(93, 77, 16, 0.2)" : "rgba(255, 160, 0, 0.1)";
      default:
        return isDarkMode
          ? "rgba(72, 85, 99, 0.2)"
          : "rgba(120, 144, 156, 0.1)";
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: isDarkMode
        ? "rgba(17, 24, 39, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
      borderRadius: 20,
      ...(Platform.OS === "web"
        ? {
            boxShadow: isDarkMode
              ? "0px 8px 16px rgba(0, 0, 0, 0.4)"
              : "0px 8px 16px rgba(100, 116, 139, 0.15)",
          }
        : {
            shadowColor: isDarkMode ? "#000" : "#64748b",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDarkMode ? 0.4 : 0.15,
            shadowRadius: 16,
            elevation: 8,
          }),
      marginVertical: 16,
      borderWidth: 1,
      borderColor: isDarkMode
        ? "rgba(59, 130, 246, 0.1)"
        : "rgba(226, 232, 240, 0.8)",
    },
    headerRow: {
      flexDirection: "row",
      marginBottom: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: "hidden",
      backgroundColor: isDarkMode
        ? "rgba(30, 41, 59, 0.95)"
        : "rgba(248, 250, 252, 0.95)",
      zIndex: 2,
      paddingVertical: 8,
      borderBottomWidth: 2,
      borderBottomColor: isDarkMode
        ? "rgba(59, 130, 246, 0.2)"
        : "rgba(226, 232, 240, 0.8)",
    },
    headerCell: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderWidth: 0,
      borderBottomWidth: 2,
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.08)",
    },
    headerText: {
      color: isDarkMode ? "#e2e8f0" : "#374151",
      fontWeight: "700",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    cellText: {
      color: isDarkMode ? "#ccc" : "#546E7A",
      fontSize: 13,
    },
    row: {
      flexDirection: "row",
      marginBottom: 0,
      borderRadius: 0,
      overflow: "hidden",
      minHeight: 60,
      alignItems: "center",
    },
    cell: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.05)",
      flexShrink: 1,
      minWidth: 60,
      maxWidth: 180,
    },
    badge: {
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      alignSelf: "flex-start",
      minWidth: 80,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 2,
      width: 32,
      height: 32,
      backgroundColor: "transparent",
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    clientName: {
      color: isDarkMode ? "#e0e0e0" : "#424242",
      fontWeight: "500",
      fontSize: 13,
    },
    taskListLink: {
      color: isDarkMode ? "#8ab4f8" : "#1976D2",
      fontWeight: "500",
      textDecorationLine: "underline",
    },
    overdue: {
      color: isDarkMode ? "#ff6e6e" : "#f44336",
      fontWeight: "600",
    },
    upcoming: {
      color: isDarkMode ? "#87ceeb" : "#0288d1",
    },
    rmName: {
      fontSize: 13,
      color: isDarkMode ? "#ccc" : "#424242",
    },
    srNumber: {
      backgroundColor: isDarkMode
        ? "rgba(0, 122, 255, 0.2)"
        : "rgba(0, 122, 255, 0.1)",
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    srNumberText: {
      color: isDarkMode ? "#8ab4f8" : "#0078FF",
      fontWeight: "600",
      fontSize: 12,
    },
    verticalDivider: {
      width: 1,
      height: "80%",
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      marginHorizontal: 6,
    },
    taskTitle: {
      color: isDarkMode ? "#e0e0e0" : "#37474F",
      fontWeight: "600",
      fontSize: 14,
    },
    expandedRow: {
      backgroundColor: isDarkMode
        ? "rgba(26, 29, 35, 0.8)"
        : "rgba(246, 248, 250, 0.9)",
      overflow: "hidden",
    },
  });

  // Show empty state if no tasks
  if (safeTasks.length === 0) {
    return (
      <View style={[dynamicStyles.container, styles.container]}>
        <EmptyState isDarkMode={isDarkMode} />
      </View>
    );
  }

  return (
    <View style={[dynamicStyles.container, styles.container]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ minWidth: "100%" }}
      >
        <View>
          {/* Header Row */}
          <View style={[dynamicStyles.headerRow, styles.headerRow]}>
            <View style={[dynamicStyles.headerCell, { width: 200 }]}>
              {/* Task Name */}
              <Text style={dynamicStyles.headerText}>📋 Task Name</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 60 }]}>
              {/* SR Number */}
              <Text style={dynamicStyles.headerText}>#</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 150 }]}>
              {/* Due Date */}
              <Text style={dynamicStyles.headerText}>📅 Due Date</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 160 }]}>
              {/* Client */}
              <Text style={dynamicStyles.headerText}>👤 Client</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 140 }]}>
              {/* RM */}
              <Text style={dynamicStyles.headerText}>👨‍💼 RM</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 140 }]}>
              {/* Task List */}
              <Text style={dynamicStyles.headerText}>📝 Task List</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 130 }]}>
              {/* Status */}
              <Text style={dynamicStyles.headerText}>🔄 Status</Text>
            </View>
            <View
              style={[
                dynamicStyles.headerCell,
                { width: 160, borderRightWidth: 0 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>⚡ Actions</Text>
            </View>
          </View>

          {/* Data Rows */}
          {safeTasks.map((task, index) => {
            const isTaskOverdue = isOverdue(task.dueDate);

            return (
              <React.Fragment key={task.id}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleRowPress(task)}
                >
                  <Animated.View
                    style={[
                      dynamicStyles.row,
                      styles.row,
                      {
                        backgroundColor:
                          pressedRow === task.id
                            ? isDarkMode
                              ? "rgba(42, 42, 42, 0.9)"
                              : "rgba(230, 240, 250, 0.9)"
                            : index % 2 === 0
                            ? isDarkMode
                              ? "rgba(35, 39, 47, 0.7)"
                              : "rgba(255, 255, 255, 0.7)"
                            : isDarkMode
                            ? "rgba(26, 29, 35, 0.6)"
                            : "rgba(246, 248, 250, 0.7)",
                        borderBottomLeftRadius:
                          index === safeTasks.length - 1 ? 16 : 0,
                        borderBottomRightRadius:
                          index === safeTasks.length - 1 ? 16 : 0,
                        transform: [{ scale: scaleAnims[task.id] || 1 }],
                      },
                    ]}
                  >
                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 200, height: "100%" },
                      ]}
                    >
                      <Text
                        style={[dynamicStyles.taskTitle, { lineHeight: 18 }]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {task.title.length === 0 ? "📝 No title" : task.title}
                      </Text>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 60, alignItems: "center", height: "100%" },
                      ]}
                    >
                      <View
                        style={[
                          dynamicStyles.srNumber,
                          { width: 32, height: 32, borderRadius: 16 },
                        ]}
                      >
                        <Text
                          style={[dynamicStyles.srNumberText, { fontSize: 13 }]}
                        >
                          {index + 1}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 150, height: "100%" },
                      ]}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {isTaskOverdue ? (
                          <>
                            <MaterialIcons
                              name="schedule"
                              size={14}
                              color={isDarkMode ? "#ff6e6e" : "#f44336"}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                dynamicStyles.cellText,
                                dynamicStyles.overdue,
                                { fontSize: 12, fontWeight: "600" },
                              ]}
                            >
                              {formatDateTime(task.dueDate)}
                            </Text>
                          </>
                        ) : (
                          <>
                            <MaterialIcons
                              name="event"
                              size={14}
                              color={isDarkMode ? "#87ceeb" : "#0288d1"}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={[
                                dynamicStyles.cellText,
                                dynamicStyles.upcoming,
                                { fontSize: 12 },
                              ]}
                            >
                              {formatDateTime(task.dueDate)}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 160, height: "100%" },
                      ]}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor:
                              task?.client?.status === "ACTIVE"
                                ? "#4CAF50"
                                : "#FF9800",
                            marginRight: 6,
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[dynamicStyles.clientName, { fontSize: 12 }]}
                            numberOfLines={1}
                          >
                            {task?.client?.name || "👤 No client"}
                          </Text>
                          {task?.client?.status && (
                            <Text
                              style={[
                                dynamicStyles.cellText,
                                {
                                  fontSize: 10,
                                  opacity: 0.7,
                                  textTransform: "capitalize",
                                },
                              ]}
                            >
                              {task.client.status.toLowerCase()}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 140, height: "100%" },
                      ]}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: isDarkMode ? "#4A5568" : "#E2E8F0",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 8,
                          }}
                        >
                          <Text style={{ fontSize: 10, fontWeight: "600" }}>
                            {task.responsibleUser?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </Text>
                        </View>
                        <Text
                          style={[
                            dynamicStyles.rmName,
                            { fontSize: 12, flex: 1 },
                          ]}
                          numberOfLines={1}
                        >
                          {task.responsibleUser?.name || "Unassigned"}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 140, height: "100%", overflow: "hidden" },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => router.push(`/tasks/${task.id}`)}
                        style={{
                          backgroundColor: isDarkMode
                            ? "rgba(59, 130, 246, 0.1)"
                            : "rgba(59, 130, 246, 0.05)",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: isDarkMode
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(59, 130, 246, 0.2)",
                        }}
                      >
                        <Text
                          style={[dynamicStyles.taskListLink, { fontSize: 11 }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {task.taskList?.name || "📝 No list"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 130, height: "100%" },
                      ]}
                    >
                      <View
                        style={[
                          dynamicStyles.badge,
                          {
                            backgroundColor: getStatusBgColor(task.status),
                          },
                        ]}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {task.status === "COMPLETED" ? (
                            <AntDesign
                              name="checkcircle"
                              size={12}
                              color={getStatusColor(task.status)}
                              style={{ marginRight: 4 }}
                            />
                          ) : task.status === "IN_PROGRESS" ? (
                            <MaterialIcons
                              name="pending-actions"
                              size={12}
                              color={getStatusColor(task.status)}
                              style={{ marginRight: 4 }}
                            />
                          ) : (
                            <MaterialIcons
                              name="watch-later"
                              size={12}
                              color={getStatusColor(task.status)}
                              style={{ marginRight: 4 }}
                            />
                          )}
                          <Text
                            style={[
                              dynamicStyles.badgeText,
                              {
                                color: getStatusColor(task.status),
                              },
                            ]}
                          >
                            {task.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 160, borderRightWidth: 0, height: "100%" },
                      ]}
                    >
                      <View
                        style={[
                          dynamicStyles.actionRow,
                          { justifyContent: "space-between" },
                        ]}
                      >
                        <TouchableOpacity
                          style={[
                            dynamicStyles.actionButton,
                            {
                              backgroundColor: "transparent",
                              borderWidth: 1,
                              borderColor: isDarkMode
                                ? "rgba(34, 197, 94, 0.4)"
                                : "rgba(34, 197, 94, 0.3)",
                            },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            try {
                              router.push({
                                pathname: `/tasks/[task_id]/[user_id]/remark_modal`,
                                params: {
                                  task_id: task.id,
                                  user_id: user_id as string,
                                },
                              });
                            } catch (error) {
                              console.error("Navigation error:", error);
                              // Fallback navigation
                              router.push(
                                `/tasks/${task.id}/${user_id}/remark_modal`
                              );
                            }
                          }}
                          accessibilityLabel="Add remark to task"
                          accessibilityHint="Opens a modal to add comments or remarks to this task"
                        >
                          <Feather
                            name="message-square"
                            size={14}
                            color={isDarkMode ? "#22c55e" : "#16a34a"}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            dynamicStyles.actionButton,
                            {
                              backgroundColor: "transparent",
                              borderWidth: 1,
                              borderColor: "rgba(59, 130, 246, 0.6)",
                            },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();

                            if (!task.taskList?.id) {
                              console.warn("Task list ID is missing");
                              return;
                            }

                            try {
                              const params = {
                                task_id: task.id,
                                user_id: user_id,
                                task_list_id: task.taskList.id,
                              };

                              router.push({
                                pathname: `/tasks/[task_id]/[user_id]/[task_list_id]/status_modal`,
                                params,
                              });
                            } catch (error) {
                              console.error("Navigation error:", error);
                              // Fallback navigation
                              router.push(
                                `/tasks/${task.id}/${user_id}/${task.taskList.id}/status_modal`
                              );
                            }
                          }}
                          accessibilityLabel="Update task status"
                          accessibilityHint="Opens a modal to change the task status and task list"
                        >
                          <Feather name="edit-3" size={14} color="#3b82f6" />
                        </TouchableOpacity>

                        {/* Eye icon for task detail */}
                        <TouchableOpacity
                          style={[
                            dynamicStyles.actionButton,
                            {
                              backgroundColor: "transparent",
                              borderWidth: 1,
                              borderColor: isDarkMode
                                ? "rgba(139, 92, 246, 0.4)"
                                : "rgba(139, 92, 246, 0.3)",
                            },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            try {
                              router.push({
                                pathname: "/tasks/[task_id]",
                                params: {
                                  task_id: task.id,
                                  clientName:
                                    task.client?.name || "Unknown Client",
                                },
                              });
                            } catch (error) {
                              console.error("Navigation error:", error);
                              // Fallback navigation
                              router.push(`/tasks/${task.id}`);
                            }
                          }}
                          accessibilityLabel="View task details"
                          accessibilityHint="Opens the detailed view of this task"
                        >
                          <Feather
                            name="eye"
                            size={14}
                            color={isDarkMode ? "#a78bfa" : "#8b5cf6"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>

      {/* Task Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeTaskModal}
      >
        <View
          style={[
            styles.modalContainer,
            isDarkMode && styles.modalContainerDark,
          ]}
        >
          <View
            style={[styles.modalHeader, isDarkMode && styles.modalHeaderDark]}
          >
            <TouchableOpacity
              style={[styles.closeButton, isDarkMode && styles.closeButtonDark]}
              onPress={closeTaskModal}
            >
              <Feather
                name="x"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <Text
              style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
            >
              Task Details
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedTask && (
              <TaskDetailView task={selectedTask} isDarkMode={isDarkMode} />
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    borderRadius: 16,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    marginBottom: 0,
    borderRadius: 0,
    overflow: "hidden",
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  priorityTag: {
    padding: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContainerDark: {
    backgroundColor: "#1F2937",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalHeaderDark: {
    borderBottomColor: "#374151",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  closeButtonDark: {
    backgroundColor: "#374151",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalTitleDark: {
    color: "#F9FAFB",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
});

export default TaskTable;
