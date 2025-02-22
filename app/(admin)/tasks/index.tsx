import TaskItem from "@/components/task/task_list";
import { primary_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type task_filter = "all" | "pending" | "no_updates" | "priority";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

interface FilterOption {
  id: string;
  label: string;
}

const Tasks: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const { user } = useAuth();
  console.log(`🚀 ~ user:`, user);

  const searchParams = useLocalSearchParams<{ task_type: task_filter }>();
  const router = useRouter();
  useEffect(() => {
    if (searchParams.task_type === undefined) {
      router.setParams({ task_type: "all" });
    }
  }, [searchParams]);
  const filterOptions: FilterOption[] = [
    { id: "all", label: "All Tasks" },
    { id: "delayed", label: "Delayed" },
    { id: "no_updates", label: "No Updates" },
    { id: "priority", label: "Priority" },
  ];

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["tasks", searchParams.task_type, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("task_type", searchParams.task_type);
      params.append("start_date", startDate.toISOString());
      params.append("end_date", endDate.toISOString());
      console.log(`🚀 ~ params:`, params);
      const response = await axios.get("/api/v1/task", {
        params,
      });
      return response.data;
    },
    initialData: [],
  });

  const onStartDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setShowEndPicker(true); // Show end date picker after selecting start date
    }
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setShowDateRange(true);
    }
  };

  const handleDateRangePress = () => {
    setShowStartPicker(true);
  };

  const clearDateRange = () => {
    setShowDateRange(false);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const onRefresh = async () => {
    await refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.taskHeader}>
        <Text style={styles.title}>Tasks</Text>
      </View>
      {!showDateRange ? (
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={handleDateRangePress}
        >
          <Feather name="calendar" size={20} color="#666" />
          <Text style={styles.datePickerButtonText}>Select Date Range</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.dateRangeContainer}>
          <View style={styles.dateRangeContent}>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={clearDateRange}>
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onStartDateChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContainerContent}
      >
        {filterOptions.map((filter, index) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              filter.id === searchParams.task_type && styles.activeFilterChip,
            ]}
            onPress={() => {
              router.setParams({ task_type: filter.id as task_filter });
            }}
          >
            <Text
              style={[
                styles.filterText,
                filter.id === searchParams.task_type && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.taskList}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
      >
        {data.map((task: any) => {
          return (
            <TaskItem
              key={task.id}
              title={task.title}
              description={task.description}
              priority={task?.priority}
              responsibleUser={task?.responsibleUser}
              dueDate={task?.dueDate}
              status={task?.status}
              task_list={task?.taskList}
              onPressRemark={() => {
                console.log("Remark pressed");
                if (user) {
                  router.push({
                    pathname: `/tasks/[task_id]/[user_id]/remark_modal`,
                    params: {
                      task_id: task.id,
                      user_id: user.id,
                    },
                  });
                }
              }}
              id={task.id}
            />
          );
        })}
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

  highPriority: {
    backgroundColor: "#fee2e2",
  },
  assigneeName: {
    fontSize: 16,
    color: "#666",
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
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  datePickerButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateRangeContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 4,
  },
  datePickerWrapper: {
    position: "relative",
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
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: primary_color,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Tasks;
