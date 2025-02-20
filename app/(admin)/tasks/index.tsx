import { primary_color } from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TaskItemProps {
  title: string;
  description: string;
  priority: "high" | "pending" | "low";
  category?: string;
  assignee: string;
  time: string;
}

interface FilterOption {
  id: string;
  label: string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  description,
  priority,
  assignee,
  time,
}) => (
  <View style={styles.taskItem}>
    <View style={styles.taskContent}>
      <View style={styles.taskItemHeader}>
        <Text style={styles.taskTitle}>{title}</Text>
        <View
          style={[
            styles.priorityTag,
            priority === "high"
              ? styles.highPriority
              : priority === "pending"
              ? styles.pendingPriority
              : styles.lowPriority,
          ]}
        >
          <Text style={styles.priorityText}>{priority}</Text>
        </View>
      </View>
      <Text style={styles.taskDescription}>{description}</Text>
      <View style={styles.taskFooter}>
        <Text style={styles.assigneeName}>{assignee}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.remarkButton}>
        <Text style={styles.remarkButtonText}>Remark</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Tasks: React.FC = () => {
  const filterOptions: FilterOption[] = [
    { id: "all", label: "All Tasks" },
    { id: "delayed", label: "Delayed" },
    { id: "no-updates", label: "No Updates" },
    { id: "priority", label: "Priority" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.taskHeader}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            onPress={(e) => e.stopPropagation()}
            style={styles.calendarButton}
          >
            <Ionicons name="calendar" size={16} style={styles.calendarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContainerContent}
      >
        {filterOptions.map((filter, index) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterChip, index === 0 && styles.activeFilterChip]}
          >
            <Text
              style={[
                styles.filterText,
                index === 0 && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.taskList}>
        <TaskItem
          title="Review KYC Documents"
          description="Verify and approve client KYC documentation for new account opening"
          priority="high"
          assignee="Sarah Chen"
          time="Today, 5:00 PM"
        />
      </ScrollView>

      <Link href={"/(admin)/tasks/add_task"} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  calendarIcon: {
    marginRight: 4,
  },
  calendarText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f43f5e",
  },

  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8, // Reduced from 16
    flexDirection: "row",
    flexGrow: 0, // Added fixed height
  },

  filterContainerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%", // Ensure content fills container height
  },

  filterChip: {
    paddingHorizontal: 16, // Reduced from 20
    paddingVertical: 8, // Reduced from 12
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    minWidth: 90, // Reduced from 100
    alignSelf: "center", // Changed from flex-start to center
    height: 36, // Added fixed height
    justifyContent: "center", // Center content vertically
  },
  activeFilterChip: {
    backgroundColor: primary_color,
  },
  filterText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
  },
  activeFilterText: {
    color: "#fff",
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  taskContent: {
    gap: 12,
  },
  taskItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  priorityTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  highPriority: {
    backgroundColor: "#fee2e2",
  },
  priorityText: {
    fontSize: 14,
  },
  taskDescription: {
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assigneeName: {
    fontSize: 16,
    color: "#666",
  },
  timeText: {
    fontSize: 16,
    color: "#666",
  },
  remarkButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 8,
  },
  remarkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: primary_color,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#6366f1",
  },
  activeNavText: {
    color: "#6366f1",
    fontWeight: "500",
  },
  pendingPriority: {
    backgroundColor: "#fff2cc",
  },
  lowPriority: {
    backgroundColor: "#d1e7dd",
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Tasks;
