import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  useColorScheme,
  View,
} from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface TaskTableProps {
  tasks: Array<{
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
              backgroundColor: `${task.priority.color}20`,
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
                backgroundColor: task.priority.color,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                color: task.priority.color,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {task.priority.name}
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
            {task.responsibleUser.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, user_id }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();
  const [pressedRow, setPressedRow] = React.useState<string | null>(null);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({}).current;
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

  const toggleRowExpand = (taskId: string) => {
    const isExpanding = expandedRow !== taskId;

    // If there's a currently expanded row, animate it closed
    if (expandedRow && expandedRow !== taskId) {
      animateExpand(expandedRow, false);
    }

    // Animate the new row
    if (isExpanding) {
      setExpandedRow(taskId);
      animateExpand(taskId, true);
    } else {
      animateExpand(taskId, false);
      // Wait for animation to complete before setting expandedRow to null
      setTimeout(() => setExpandedRow(null), 300);
    }
  };

  const handleRowPress = (taskId: string) => {
    setPressedRow(taskId);

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnims[taskId], {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(scaleAnims[taskId], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start(() => {
      setPressedRow(null);
      toggleRowExpand(taskId);
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
        ? "rgba(24, 24, 24, 0.9)"
        : "rgba(248, 249, 250, 0.9)",
      borderRadius: 16,
      shadowColor: isDarkMode ? "#000" : "#aaa",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 5,
      marginVertical: 16,
      borderWidth: 1,
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
    },
    headerRow: {
      flexDirection: "row",
      marginBottom: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden",
      backgroundColor: isDarkMode
        ? "rgba(35, 39, 47, 0.9)"
        : "rgba(255, 255, 255, 0.9)",
      zIndex: 2,
      paddingVertical: 4,
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
      color: isDarkMode ? "#a0a8b8" : "#546E7A",
      fontWeight: "600",
      fontSize: 13,
      textTransform: "uppercase",
      letterSpacing: 0.5,
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
      padding: 10,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
      width: 34,
      height: 34,
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

  return (
    <View style={[dynamicStyles.container, styles.container]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Header Row */}
          <View style={[dynamicStyles.headerRow, styles.headerRow]}>
            <View style={[dynamicStyles.headerCell, { width: 180 }]}>
              {/* Task Name */}
              <Text style={dynamicStyles.headerText}>Task Name</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 50 }]}>
              {/* SR Number */}
              <Text style={dynamicStyles.headerText}>#</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 130 }]}>
              {/* Due Date */}
              <Text style={dynamicStyles.headerText}>Due Date</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 140 }]}>
              {/* Client */}
              <Text style={dynamicStyles.headerText}>Client</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 120 }]}>
              {/* RM */}
              <Text style={dynamicStyles.headerText}>RM</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 120 }]}>
              {/* Task List */}
              <Text style={dynamicStyles.headerText}>Task List</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 110 }]}>
              {/* Status */}
              <Text style={dynamicStyles.headerText}>Status</Text>
            </View>
            <View
              style={[
                dynamicStyles.headerCell,
                { width: 140, borderRightWidth: 0 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Actions</Text>
            </View>
          </View>

          {/* Data Rows */}
          {tasks.map((task, index) => {
            const isTaskOverdue = isOverdue(task.dueDate);
            const isExpanded = expandedRow === task.id;

            return (
              <React.Fragment key={task.id}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleRowPress(task.id)}
                >
                  <Animated.View
                    style={[
                      dynamicStyles.row,
                      styles.row,
                      {
                        backgroundColor: isExpanded
                          ? isDarkMode
                            ? "rgba(50, 50, 70, 0.9)"
                            : "rgba(220, 235, 250, 0.9)"
                          : pressedRow === task.id
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
                          !isExpanded && index === tasks.length - 1 ? 16 : 0,
                        borderBottomRightRadius:
                          !isExpanded && index === tasks.length - 1 ? 16 : 0,
                        transform: [{ scale: scaleAnims[task.id] || 1 }],
                      },
                    ]}
                  >
                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 180, height: "100%" },
                      ]}
                    >
                      <Text
                        style={dynamicStyles.taskTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {task.title.length === 0 ? "N/A" : task.title}
                      </Text>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 50, alignItems: "center", height: "100%" },
                      ]}
                    >
                      <View style={dynamicStyles.srNumber}>
                        <Text style={dynamicStyles.srNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 130, height: "100%" },
                      ]}
                    >
                      <Text
                        style={[
                          dynamicStyles.cellText,
                          isTaskOverdue
                            ? dynamicStyles.overdue
                            : dynamicStyles.upcoming,
                        ]}
                      >
                        {isTaskOverdue ? (
                          <React.Fragment>
                            <MaterialIcons
                              name="schedule"
                              size={12}
                              color={isDarkMode ? "#ff6e6e" : "#f44336"}
                            />
                            <Text>{" " + formatDateTime(task.dueDate)}</Text>
                          </React.Fragment>
                        ) : (
                          formatDateTime(task.dueDate)
                        )}
                      </Text>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 140, height: "100%" },
                      ]}
                    >
                      <Text style={dynamicStyles.clientName} numberOfLines={1}>
                        {task?.client?.name || "—"}
                      </Text>
                      {task?.client?.status && (
                        <Text
                          style={[
                            dynamicStyles.cellText,
                            { fontSize: 11, opacity: 0.8 },
                          ]}
                        >
                          {task.client.status}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 120, height: "100%" },
                      ]}
                    >
                      <Text style={dynamicStyles.rmName}>
                        {task.responsibleUser.name}
                      </Text>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 120, height: "100%", overflow: "hidden" },
                      ]}
                    >
                      <Link href={`/tasks/${task.id}`}>
                        <Text
                          style={dynamicStyles.taskListLink}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {task.taskList?.name || "—"}
                        </Text>
                      </Link>
                    </View>

                    <View
                      style={[
                        dynamicStyles.cell,
                        { width: 110, height: "100%" },
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
                        { width: 140, borderRightWidth: 0, height: "100%" },
                      ]}
                    >
                      <View style={dynamicStyles.actionRow}>
                        <TouchableOpacity
                          style={[
                            dynamicStyles.actionButton,
                            {
                              backgroundColor: isDarkMode
                                ? "rgba(68, 68, 68, 0.6)"
                                : "rgba(245, 245, 245, 0.8)",
                            },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push({
                              pathname: `/tasks/[task_id]/[user_id]/remark_modal`,
                              params: {
                                task_id: task.id,
                                user_id: user_id as string,
                              },
                            });
                          }}
                        >
                          <Feather
                            name="message-square"
                            size={16}
                            color={isDarkMode ? "#a0a8b8" : "#546E7A"}
                          />
                        </TouchableOpacity>

                        <View style={dynamicStyles.verticalDivider} />

                        <TouchableOpacity
                          style={[
                            dynamicStyles.actionButton,
                            { backgroundColor: "rgba(0, 122, 255, 0.9)" },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            const params = {
                              task_id: task.id,
                              user_id: user_id,
                              task_list_id: task.taskList?.id!,
                            };

                            router.push({
                              pathname: `/tasks/[task_id]/[user_id]/[task_list_id]/status_modal`,
                              params,
                            });
                          }}
                        >
                          <Feather name="list" size={16} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Eye icon for task detail */}
                        <TouchableOpacity
                          style={[
                            dynamicStyles.actionButton,
                            {
                              backgroundColor: isDarkMode
                                ? "rgba(34, 34, 34, 0.8)"
                                : "rgba(224, 231, 239, 0.9)",
                            },
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push({
                              pathname: "/tasks/[task_id]",
                              params: { task_id: task.id },
                            });
                          }}
                        >
                          <Feather
                            name="eye"
                            size={16}
                            color={isDarkMode ? "#e0e0e0" : "#37474F"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                </TouchableOpacity>

                {/* Expandable Detail View */}
                {isExpanded && (
                  <Animated.View
                    style={[
                      dynamicStyles.expandedRow,
                      {
                        borderBottomLeftRadius:
                          index === tasks.length - 1 ? 16 : 0,
                        borderBottomRightRadius:
                          index === tasks.length - 1 ? 16 : 0,
                        opacity: expandAnims[task.id].opacity,
                        maxHeight: expandAnims[task.id].height.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "1000%"],
                        }),
                        transform: [
                          {
                            scale: expandAnims[task.id].opacity.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.95, 1],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <TaskDetailView task={task} isDarkMode={isDarkMode} />
                  </Animated.View>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
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
});

export default TaskTable;
