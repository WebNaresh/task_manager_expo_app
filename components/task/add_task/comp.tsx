import { PriorityData } from "@/app/(admin)/dashboard";
import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { error_color, success_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  title: z.string().trim(),
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters long" }),
  dueDate: z
    .string()
    .trim()
    .min(3, { message: "Due date must be at least 3 characters long" }),
  taskListId: z
    .string()
    .trim()
    .min(3, { message: "Tasklist must be at least 3 characters long" }),
  responsibleUserId: z
    .string()
    .trim()
    .min(3, { message: "Assigned RM must be at least 3 characters long" }),
  clientId: z
    .string()
    .trim()
    .min(3, { message: "Client must be at least 3 characters long" }),
  priorityId: z
    .string()
    .trim()
    .min(3, { message: "Priority must be at least 3 characters long" }),
  assignedById: z
    .string()
    .trim()
    .min(3, { message: "Assigned by must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

type Props = {
  clients: any[];
  managers: any[];
  tasklists: any[];
  priorities: PriorityData[];
  assignedById: string;
};

const AddTaskForm = (props: Props) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();

  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      taskListId: "",
      responsibleUserId: "",
      clientId: "",
      priorityId: "",
      assignedById: props.assignedById,
    },
  });
  const query_client = useQueryClient();
  const auth = useAuth();

  const { handleSubmit, formState, reset } = form;

  console.log(`🚀 ~ formState`, formState.errors);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setRefreshing(false);
  }, [reset]);

  const onSubmit = (data: Form) => {
    console.log(`🚀 ~ data:`, data);
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Form) => {
      //  axios request here /api/v1/task
      console.log(`🚀 ~ data:`, data);
      const response = await axios.post("/api/v1/task", data);
      console.log(`🚀 ~ response:`, response.data);
      return response.data;
    },
    onSuccess(data, variables, context) {
      query_client.invalidateQueries({
        queryKey: ["tasks"],
      });
      Toast.show("Task created successfully", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: success_color,
      });
      if (auth.user?.role === "ADMIN") {
        router.push("/(admin)/tasks");
      } else {
        router.push("/(manager)/tasks");
      }
    },
    onError(error, variables, context) {
      if (isAxiosError(error)) {
        console.error(`🚀 ~ error.response.data:`, error?.response?.data);
        Toast.show(error?.response?.data?.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: error_color,
        });
      }
    },
  });

  return (
    <ScrollView
      contentContainerStyle={[
        { paddingBottom: 26 },
        isDarkMode && styles.darkContainer,
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View
        style={[styles.headerSection, isDarkMode && styles.headerSectionDark]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backButton, isDarkMode && styles.backButtonDark]}
            onPress={() => {
              if (auth.user?.role === "ADMIN") {
                router.push("/(admin)/tasks");
              } else {
                router.push("/(manager)/tasks");
              }
            }}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={isDarkMode ? "#fff" : "#222"}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text
              style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}
            >
              Create New Task
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                isDarkMode && styles.headerSubtitleDark,
              ]}
            >
              Fill in the details to create a new task
            </Text>
          </View>
        </View>
      </View>

      {/* Form Card */}
      <View style={[styles.formCard, isDarkMode && styles.formCardDark]}>
        {/* Basic Information Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: "#3B82F6" }]}>
              <Feather name="edit-3" size={16} color="#fff" />
            </View>
            <Text
              style={[
                styles.sectionTitle,
                isDarkMode && styles.sectionTitleDark,
              ]}
            >
              Basic Information
            </Text>
          </View>

          <View style={styles.sectionContent}>
            <NBTextInput
              form={form}
              name="title"
              placeholder="Enter task title"
              type="text"
              icon={
                <Feather
                  name="type"
                  size={20}
                  color={isDarkMode ? "white" : "#6B7280"}
                />
              }
            />

            <NBTextInput
              form={form}
              name="description"
              placeholder="Enter task description"
              type="textarea"
              icon={
                <Feather
                  name="file-text"
                  size={20}
                  color={isDarkMode ? "white" : "#6B7280"}
                />
              }
            />
          </View>
        </View>

        {/* Assignment Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: "#10B981" }]}>
              <Feather name="users" size={16} color="#fff" />
            </View>
            <Text
              style={[
                styles.sectionTitle,
                isDarkMode && styles.sectionTitleDark,
              ]}
            >
              Assignment & Client
            </Text>
          </View>

          <View style={styles.sectionContent}>
            <NBTextInput
              form={form}
              name="responsibleUserId"
              placeholder="Select responsible manager"
              type="select"
              icon={
                <Feather
                  name="user"
                  size={20}
                  color={isDarkMode ? "white" : "#6B7280"}
                />
              }
              options={props.managers.map((manager) => ({
                label: manager.name,
                value: manager.id,
              }))}
            />

            <NBTextInput
              form={form}
              name="clientId"
              placeholder="Select client"
              type="select"
              icon={
                <Feather
                  name="briefcase"
                  size={20}
                  color={isDarkMode ? "white" : "#6B7280"}
                />
              }
              options={[
                {
                  label: "➕ Add New Client",
                  value: "add_new",
                },
                ...props.clients.map((client) => ({
                  label: client.name,
                  value: client.id,
                })),
              ]}
              onSelect={(value) => {
                if (value === "add_new") {
                  form.setValue("clientId", "");
                  router.push("/add_client_modal");
                }
              }}
            />
          </View>
        </View>

        {/* Task Details Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: "#F59E0B" }]}>
              <Feather name="settings" size={16} color="#fff" />
            </View>
            <Text
              style={[
                styles.sectionTitle,
                isDarkMode && styles.sectionTitleDark,
              ]}
            >
              Task Details
            </Text>
          </View>

          <View style={styles.sectionContent}>
            <NBTextInput
              form={form}
              name="taskListId"
              placeholder="Select task list"
              type="select"
              icon={
                <Feather
                  name="list"
                  size={20}
                  color={isDarkMode ? "white" : "#6B7280"}
                />
              }
              options={[
                {
                  label: "➕ Add New Tasklist",
                  value: "add_new",
                },
                ...props.tasklists.map((tasklist) => ({
                  label: tasklist.name,
                  value: tasklist.id,
                })),
              ]}
              onSelect={(value) => {
                if (value === "add_new") {
                  form.setValue("taskListId", "");
                  router.push("/add_tasklist_modal");
                }
              }}
            />

            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <NBTextInput
                  form={form}
                  name="dueDate"
                  placeholder="Select due date"
                  type="date"
                  icon={
                    <Feather
                      name="calendar"
                      size={20}
                      color={isDarkMode ? "white" : "#6B7280"}
                    />
                  }
                />
              </View>

              <View style={styles.halfWidth}>
                <NBTextInput
                  form={form}
                  name="priorityId"
                  placeholder="Select priority"
                  type="select"
                  icon={
                    <Feather
                      name="flag"
                      size={20}
                      color={isDarkMode ? "white" : "#6B7280"}
                    />
                  }
                  options={props.priorities.map((priority) => ({
                    label: priority.name,
                    value: priority.id,
                  }))}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <NBButton
            text={isPending ? "Creating Task..." : "Create Task"}
            onPress={handleSubmit(onSubmit)}
            isPending={formState.isSubmitting || isPending}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AddTaskForm;

const styles = StyleSheet.create({
  darkContainer: {
    backgroundColor: "#111827",
  },

  // Header Styles
  headerSection: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerSectionDark: {
    backgroundColor: "#1F2937",
    borderBottomColor: "#374151",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  backButtonDark: {
    backgroundColor: "#374151",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerTitleDark: {
    color: "#F9FAFB",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  headerSubtitleDark: {
    color: "#9CA3AF",
  },

  // Form Card Styles
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }),
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 20,
  },
  formCardDark: {
    backgroundColor: "#1F2937",
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
        }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.3,
        }),
  },

  // Section Styles
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  sectionTitleDark: {
    color: "#F9FAFB",
  },
  sectionContent: {
    gap: 16,
  },

  // Layout Styles
  rowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },

  // Submit Button
  submitContainer: {
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
});
