import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

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

const TaskTable: React.FC<TaskTableProps> = ({ tasks, user_id }) => {
  console.log(`🚀 ~ tasks:`, tasks);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();
  const [pressedRow, setPressedRow] = React.useState<string | null>(null);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: isDarkMode ? "#181818" : "#f8f9fa",
      borderRadius: 14,
      shadowColor: isDarkMode ? "#000" : "#aaa",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      marginVertical: 12,
    },
    headerRow: {
      flexDirection: "row",
      marginBottom: 0,
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      overflow: "hidden",
      backgroundColor: isDarkMode ? "#23272f" : "#fff",
      zIndex: 2,
    },
    headerCell: {
      paddingVertical: 14,
      paddingHorizontal: 10,
      borderWidth: 0,
      borderBottomWidth: 2,
      borderColor: "#e0e0e0",
    },
    headerText: {
      color: isDarkMode ? "#ccc" : "#666",
    },
    cellText: {
      color: isDarkMode ? "#ccc" : "#666",
    },
    row: {
      flexDirection: "row",
      marginBottom: 0,
      borderRadius: 0,
      overflow: "hidden",
      minHeight: 54,
      alignItems: "center",
    },
    cell: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: "#e0e0e0",
      flexShrink: 1,
      minWidth: 60,
      maxWidth: 180,
    },
    badge: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf: "flex-start",
      minWidth: 60,
      alignItems: "center",
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#fff",
      textTransform: "capitalize",
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 2,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });

  return (
    <View style={[dynamicStyles.container, styles.container]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Header Row */}
          <View style={[dynamicStyles.headerRow, styles.headerRow]}>
            {/* Add SR header */}
            <View style={[dynamicStyles.headerCell, { width: 50 }]}>
              <Text style={dynamicStyles.headerText}>SR</Text>
            </View>

            <View style={[dynamicStyles.headerCell, { width: 120 }]}>
              <Text style={dynamicStyles.headerText}>Due Date</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 120 }]}>
              <Text style={dynamicStyles.headerText}>Client Name</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 120 }]}>
              <Text style={dynamicStyles.headerText}>RM</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 100 }]}>
              <Text style={dynamicStyles.headerText}>Task List</Text>
            </View>
            <View style={[dynamicStyles.headerCell, { width: 100 }]}>
              <Text style={dynamicStyles.headerText}>Status</Text>
            </View>
            <View
              style={[
                dynamicStyles.headerCell,
                { width: 120, borderRightWidth: 0 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Actions</Text>
            </View>
          </View>

          {/* Data Rows */}
          {tasks.map((task, index) => (
            <View
              key={task.id}
              style={[
                dynamicStyles.row,
                styles.row,
                {
                  backgroundColor:
                    pressedRow === task.id
                      ? isDarkMode
                        ? "#2a2a2a"
                        : "#e6f0fa"
                      : index % 2 === 0
                      ? isDarkMode
                        ? "#23272f"
                        : "#fff"
                      : isDarkMode
                      ? "#1a1d23"
                      : "#f6f8fa",
                  borderBottomLeftRadius: index === tasks.length - 1 ? 14 : 0,
                  borderBottomRightRadius: index === tasks.length - 1 ? 14 : 0,
                  shadowColor:
                    pressedRow === task.id ? "#007AFF" : "transparent",
                  shadowOpacity: pressedRow === task.id ? 0.12 : 0,
                  shadowRadius: pressedRow === task.id ? 8 : 0,
                  elevation: pressedRow === task.id ? 2 : 0,
                },
              ]}
              onTouchStart={() => setPressedRow(task.id)}
              onTouchEnd={() => setPressedRow(null)}
            >
              {/* Add SR cell */}
              <View style={[dynamicStyles.cell, { width: 50 }]}>
                <Text style={dynamicStyles.cellText}>{index + 1}</Text>
              </View>

              <View style={[dynamicStyles.cell, { width: 120 }]}>
                <Text style={dynamicStyles.cellText}>
                  {formatDateTime(task.dueDate)}
                </Text>
              </View>
              <View style={[dynamicStyles.cell, { width: 120 }]}>
                <Text style={dynamicStyles.cellText} numberOfLines={1}>
                  {task?.client?.name || "—"} {/* Client name cell */}
                </Text>
              </View>
              <View style={[dynamicStyles.cell, { width: 120 }]}>
                <Text style={dynamicStyles.cellText}>
                  {task.responsibleUser.name}
                </Text>
              </View>
              <View
                style={[dynamicStyles.cell, { width: 100, overflow: "hidden" }]}
              >
                <Link href={`/tasks/${task.id}`}>
                  <Text
                    style={[
                      dynamicStyles.cellText,
                      { flex: 1, display: "flex" },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {task.taskList?.name || "—"}
                  </Text>
                </Link>
              </View>
              <View style={[dynamicStyles.cell, { width: 100 }]}>
                <View
                  style={[
                    dynamicStyles.badge,
                    {
                      backgroundColor:
                        task.status === "COMPLETED"
                          ? isDarkMode
                            ? "#0D5D56"
                            : "#E0F7FA"
                          : isDarkMode
                          ? "#5D4D10"
                          : "#FFF9E7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      dynamicStyles.badgeText,
                      {
                        color:
                          task.status === "COMPLETED"
                            ? isDarkMode
                              ? "#80CBC4"
                              : "#00BFA5"
                            : isDarkMode
                            ? "#FFD54F"
                            : "#FFB800",
                      },
                    ]}
                  >
                    {task.status}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  dynamicStyles.cell,
                  { width: 120, borderRightWidth: 0 },
                ]}
              >
                <View style={dynamicStyles.actionRow}>
                  <TouchableOpacity
                    style={[
                      dynamicStyles.actionButton,
                      { backgroundColor: isDarkMode ? "#444" : "#F5F5F5" },
                    ]}
                    onPress={() => {
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
                      color={isDarkMode ? "#ccc" : "#666666"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      dynamicStyles.actionButton,
                      { backgroundColor: "#007AFF" },
                    ]}
                    onPress={() => {
                      const params = {
                        task_id: task.id,
                        user_id: user_id,
                        task_list_id: task.taskList?.id!,
                      };
                      console.log(`🚀 ~ params:`, params);

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
                      { backgroundColor: isDarkMode ? "#222" : "#e0e7ef" },
                    ]}
                    onPress={() => {
                      router.push({
                        pathname: "/tasks/[task_id]",
                        params: { task_id: task.id },
                      });
                    }}
                  >
                    <Feather
                      name="eye"
                      size={16}
                      color={isDarkMode ? "#fff" : "#222"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    borderColor: "#e0e0e0",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
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
