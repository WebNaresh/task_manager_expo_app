import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  value: string;
  color: string;
}

interface PriorityItemProps {
  level: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <View style={[styles.card, { backgroundColor: "white" }]}>
    <MaterialCommunityIcons name={icon} size={24} color={color} />
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const PriorityItem: React.FC<PriorityItemProps> = ({ level, color }) => (
  <View style={styles.priorityRow}>
    <Text style={styles.priorityText}>Priority {level}</Text>
    <Text style={styles.colorLabel}>Color</Text>
    <View style={[styles.colorBar, { backgroundColor: color }]} />
  </View>
);

const TaskDashboard: React.FC = () => {
  const stats: StatCardProps[] = [
    {
      icon: "format-list-checks",
      title: "Total Tasks",
      value: "24",
      color: "#4285F4",
    },
    {
      icon: "alert",
      title: "No Updates",
      value: "5",
      color: "#FFA000",
    },
    {
      icon: "clock-alert",
      title: "Delayed",
      value: "3",
      color: "#DB4437",
    },
    {
      icon: "account-group",
      title: "RM",
      value: "3",
      color: "#673AB7",
    },
    {
      icon: "check-circle",
      title: "Completed",
      value: "16",
      color: "#0F9D58",
    },
    {
      icon: "format-list-bulleted",
      title: "Tasklist",
      value: "8",
      color: "#DB4437",
    },
    {
      icon: "account",
      title: "Client",
      value: "8",
      color: "#673AB7",
    },
  ];

  const priorities: PriorityItemProps[] = [
    { level: "1", color: "#0F9D58" },
    { level: "2", color: "#FFA000" },
    { level: "3", color: "#4285F4" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      <View style={styles.prioritySection}>
        <View style={styles.priorityHeader}>
          <Text style={styles.priorityTitle}>Prioritys</Text>
          <Text style={styles.addPriority}>Add Priority</Text>
        </View>
        {priorities.map((priority, index) => (
          <PriorityItem key={index} {...priority} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    justifyContent: "space-between",
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
  prioritySection: {
    backgroundColor: "white",
    padding: 16,
    margin: 8,
    borderRadius: 8,
  },
  priorityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priorityTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addPriority: {
    color: "#4285F4",
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  priorityText: {
    flex: 1,
  },
  colorLabel: {
    marginRight: 8,
    color: "#666",
  },
  colorBar: {
    width: 100,
    height: 8,
    borderRadius: 4,
  },
});

export default TaskDashboard;
