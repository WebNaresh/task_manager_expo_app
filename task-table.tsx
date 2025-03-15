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

  const dynamicStyles = StyleSheet.create({
    headerCell: {
      backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
    },
    headerText: {
      color: isDarkMode ? "#ccc" : "#666",
    },
    cellText: {
      color: isDarkMode ? "#ccc" : "#666",
    },
    statusContainer: {
      padding: 4,
      borderRadius: 4,
    },
    actionButton: {
      padding: 8,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.headerCell,
                dynamicStyles.headerCell,
                { width: 100 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Task List</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                dynamicStyles.headerCell,
                { width: 120 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Due Date</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                dynamicStyles.headerCell,
                { width: 120 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Client Name</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                dynamicStyles.headerCell,
                { width: 120 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Assigned To</Text>
            </View>

            <View
              style={[
                styles.headerCell,
                dynamicStyles.headerCell,
                { width: 100 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Status</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                dynamicStyles.headerCell,
                { width: 120 },
              ]}
            >
              <Text style={dynamicStyles.headerText}>Actions</Text>
            </View>
          </View>

          {/* Data Rows */}
          {tasks.map((task) => (
            <View key={task.id} style={styles.row}>
              <View style={[styles.cell, { width: 100 }]}>
                <Link href={`/tasks/${task.id}`}>
                  <Text style={dynamicStyles.cellText} numberOfLines={1}>
                    {task.taskList?.name || "—"}
                  </Text>
                </Link>
              </View>
              <View style={[styles.cell, { width: 120 }]}>
                <Text style={dynamicStyles.cellText}>
                  {formatDateTime(task.dueDate)}
                </Text>
              </View>
              <View style={[styles.cell, { width: 120 }]}>
                <Text style={dynamicStyles.cellText} numberOfLines={1}>
                  {task?.client?.name || "—"} {/* Client name cell */}
                </Text>
              </View>
              <View style={[styles.cell, { width: 120 }]}>
                <Text style={dynamicStyles.cellText}>
                  {task.responsibleUser.name}
                </Text>
              </View>

              <View style={[styles.cell, { width: 100 }]}>
                <View
                  style={[
                    dynamicStyles.statusContainer,
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
                      styles.statusText,
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
              <View style={[styles.cell, { width: 120 }]}>
                <View style={styles.actionContainer}>
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
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  headerCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  cell: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
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
