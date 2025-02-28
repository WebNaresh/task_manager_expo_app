import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type Href, Link } from "expo-router";
import type React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  value: string;
  color: string;
  link: Href;
}

interface PriorityItemProps {
  name: string;
  color: string;
  number: number;
  id: string; // Add id for identifying which priority to edit
}

export interface PriorityData {
  color: string;
  createdAt: string;
  id: string;
  name: string;
  number: number;
  updatedAt: string;
}

type ApiResponse = {
  clientCount: number;
  completedTaskCount: number;
  delayedTaskCount: number;
  taskWithNoUpdatesCount: number;
  totalRmsCount: number;
  totalTaskCount: number;
  totalTaskListCount: number;
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
  link,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <Link
      href={link as any}
      style={[styles.card, isDarkMode && styles.cardDark]}
    >
      <View style={[]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={[styles.value, isDarkMode && styles.valueDark]}>
          {value}
        </Text>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          {title}
        </Text>
      </View>
    </Link>
  );
};

const PriorityItem: React.FC<PriorityItemProps> = ({
  name,
  color,
  number,
  id,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={[styles.priorityRow, isDarkMode && styles.priorityRowDark]}>
      <Text
        style={[styles.priorityName, isDarkMode && styles.priorityNameDark]}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={styles.colorSection}>
          <View style={[styles.colorBar, { backgroundColor: color }]} />
        </View>
        <Text
          style={[
            styles.priorityNumber,
            isDarkMode && styles.priorityNumberDark,
          ]}
        >
          {number}
        </Text>
      </View>

      <Link
        href={`/(admin)/dashboard/${id}?number=${number}&name=${name}&color=${color}`}
        style={[styles.editButton, isDarkMode && styles.editButtonDark]}
      >
        <MaterialCommunityIcons
          name="pencil"
          size={18}
          color={isDarkMode ? "#8AB4F8" : "#4285F4"}
        />
      </Link>
    </View>
  );
};

const TaskDashboard: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { data, isLoading, isError, refetch } = useQuery<PriorityData[]>({
    queryKey: ["priority"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/priority");
      return response.data;
    },
  });

  const { data: stat } = useQuery({
    queryKey: ["stat"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/task/dashboard/statistics");
      return response.data as ApiResponse;
    },
    initialData: null,
  });

  const stats: StatCardProps[] = [
    {
      icon: "format-list-checks",
      title: "Total Tasks",
      value: stat?.totalTaskCount.toString() ?? "0",
      color: "#4285F4",
      link: "/(admin)/tasks?task_type=all",
    },
    {
      icon: "alert",
      title: "No Updates",
      value: stat?.taskWithNoUpdatesCount.toString() ?? "0",
      color: "#FFA000",
      link: "/(admin)/tasks?task_type=no_updates",
    },
    {
      icon: "clock-alert",
      title: "Delayed",
      value: stat?.delayedTaskCount.toString() ?? "0",
      color: "#DB4437",
      link: "/(admin)/tasks?task_type=delayed",
    },
    {
      icon: "account-group",
      title: "RM",
      value: stat?.totalRmsCount.toString() ?? "0",
      color: "#673AB7",
      link: "/(admin)/dashboard/manager",
    },
    {
      icon: "check-circle",
      title: "Completed",
      value: stat?.completedTaskCount.toString() ?? "0",
      color: "#0F9D58",
      link: "/(admin)/tasks?task_type=completed",
    },
    {
      icon: "format-list-bulleted",
      title: "Tasklist",
      value: stat?.totalTaskListCount.toString() ?? "0",
      color: "#DB4437",
      link: "/(admin)/dashboard/tasklist",
    },
    {
      icon: "account",
      title: "Client",
      value: stat?.clientCount.toString() ?? "0",
      color: "#673AB7",
      link: "/(admin)/dashboard/client",
    },
  ];

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <View style={styles.statSection}>
        <View style={styles.statGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>
      </View>

      <View
        style={[
          styles.prioritySection,
          isDarkMode && styles.prioritySectionDark,
        ]}
      >
        <View style={styles.priorityHeader}>
          <Text
            style={[
              styles.priorityTitle,
              isDarkMode && styles.priorityTitleDark,
            ]}
          >
            Priorities
          </Text>
          <Link
            href={"/modal"}
            style={[styles.addPriority, isDarkMode && styles.addPriorityDark]}
          >
            Add Priority
          </Link>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4285F4"
            style={styles.loader}
          />
        ) : isError ? (
          <Text style={[styles.errorText, isDarkMode && styles.errorTextDark]}>
            Error loading priorities
          </Text>
        ) : (
          data?.map((priority) => (
            <PriorityItem
              key={priority.id}
              id={priority.id}
              name={priority.name}
              color={priority.color}
              number={priority.number}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  statSection: {
    padding: 16,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  prioritySection: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  prioritySectionDark: {
    backgroundColor: "#1E1E1E",
  },
  priorityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priorityTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  priorityTitleDark: {
    color: "white",
  },
  addPriority: {
    color: "#4285F4",
    fontSize: 16,
  },
  addPriorityDark: {
    color: "#8AB4F8",
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  priorityRowDark: {
    borderBottomColor: "#333",
  },
  priorityName: {
    flex: 1,
    fontSize: 16,
  },
  priorityNameDark: {
    color: "white",
  },
  priorityNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  priorityNumberDark: {
    color: "white",
  },
  colorSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorLabel: {
    marginRight: 8,
    color: "#666",
  },
  colorLabelDark: {
    color: "#B0B0B0",
  },
  colorBar: {
    width: 50,
    height: 24,
    borderRadius: 4,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "#DB4437",
    textAlign: "center",
    padding: 16,
  },
  errorTextDark: {
    color: "#CF6679",
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "white",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  valueDark: {
    color: "white",
  },
  titleDark: {
    color: "#B0B0B0",
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  editButtonDark: {
    color: "#8AB4F8",
  },
});

export default TaskDashboard;
