"use client";

import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface TaskItemProps {
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
  task_list?: any;
  id: string;
  user_id?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  description,
  priority,
  responsibleUser,
  dueDate,
  status,
  task_list: { name: tasklist_title, id: tasklist_id } = {} as any,
  id,
  user_id,
}) => {
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const dynamicStyles = StyleSheet.create({
    taskItem: {
      backgroundColor: isDarkMode ? "#333" : "#FFFFFF",
      borderRadius: 16,
      padding: 20,
      marginVertical: 10,
      ...(Platform.OS === "web"
        ? {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }),
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDarkMode ? "#fff" : "#333333",
      flex: 1,
      marginRight: 8,
    },
    taskDescription: {
      color: isDarkMode ? "#ccc" : "#666666",
      fontSize: 14,
      lineHeight: 20,
    },
    avatar: {
      backgroundColor: isDarkMode ? "#555" : "#E0E0E0",
    },
    avatarText: {
      color: isDarkMode ? "#fff" : "#333333",
    },
    userName: {
      color: isDarkMode ? "#fff" : "#333333",
    },
    timeContainer: {
      backgroundColor: isDarkMode ? "#444" : "#F0F0F0",
    },
    timeText: {
      color: isDarkMode ? "#ccc" : "#666666",
    },
    remarkButton: {
      backgroundColor: isDarkMode ? "#555" : "#F5F5F5",
    },
    remarkButtonText: {
      color: isDarkMode ? "#ccc" : "#666666",
    },
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Link href={`/tasks/${id}`} style={{ width: "100%", paddingVertical: 10 }}>
      <Animated.View
        style={[
          dynamicStyles.taskItem,
          {
            transform: [{ scale: scaleAnim }],
            width: "100%",
            height: "100%",
          },
        ]}
      >
        <View style={styles.taskContent}>
          <View style={styles.taskItemHeader}>
            <Text
              style={dynamicStyles.taskTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <View style={styles.tagContainer}>
              <View
                style={[
                  styles.statusTag,
                  {
                    backgroundColor:
                      status === "COMPLETED" ? "#E0F7FA" : "#FFF9E7",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: status === "COMPLETED" ? "#00BFA5" : "#FFB800" },
                  ]}
                >
                  {status}
                </Text>
              </View>
              <View
                style={[
                  styles.priorityTag,
                  { backgroundColor: priority.color },
                ]}
              >
                <Text style={styles.priorityText}>
                  {priority.name.toLowerCase()}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={dynamicStyles.taskDescription}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
          <View style={styles.taskFooter}>
            <View style={styles.userInfo}>
              <View style={[styles.avatar, dynamicStyles.avatar]}>
                <Text style={dynamicStyles.avatarText}>
                  {responsibleUser.name.charAt(0)}
                </Text>
              </View>
              <Text style={dynamicStyles.userName}>{responsibleUser.name}</Text>
            </View>
            <View style={[styles.timeContainer, dynamicStyles.timeContainer]}>
              <Feather
                name="calendar"
                size={14}
                color="#666666"
                style={styles.calendarIcon}
              />
              <Text style={dynamicStyles.timeText}>
                {formatDateTime(dueDate)}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.remarkButton, dynamicStyles.remarkButton]}
              onPress={() => {
                router.push({
                  pathname: `/tasks/[task_id]/[user_id]/remark_modal`,
                  params: {
                    task_id: id,
                    user_id: user_id as string,
                  },
                });
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Feather
                name="message-square"
                size={16}
                color="#666666"
                style={[styles.buttonIcon, dynamicStyles.remarkButtonText]}
              />
              <Text style={dynamicStyles.remarkButtonText}>Remark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.taskListButton}
              onPress={() => {
                router.push({
                  pathname: `/tasks/[task_id]/[user_id]/[task_list_id]/status_modal`,
                  params: {
                    task_id: id,
                    user_id: user_id as string,
                    task_list_id: tasklist_id,
                  },
                });
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Feather
                name="list"
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.taskButtonText}>{tasklist_title}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Link>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }),
  },
  taskContent: {
    gap: 12,
  },
  taskItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 60,
    alignItems: "center",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  taskDescription: {
    color: "#666666",
    fontSize: 14,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  userName: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clockIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  statusTag: {
    backgroundColor: "#FFF9E7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  statusText: {
    color: "#FFB800",
    fontSize: 12,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  remarkButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
  },
  remarkButtonText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  taskListButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
  },
  taskButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  buttonIcon: {
    marginRight: 4,
  },
  calendarIcon: {
    marginRight: 4,
  },
});

export default TaskItem;
