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
  RefreshControl,
  ScrollView,
  StyleSheet,
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
        styles.formCard,
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
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
      </View>
      <View style={styles.formContent}>
        <NBTextInput
          form={form}
          name="description"
          placeholder="Enter description"
          type="textarea"
          icon={
            <Feather
              name="file-text"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          }
        />
        <View style={styles.taskListContainer}>
          <View style={{ flex: 1 }}>
            <NBTextInput
              form={form}
              name="taskListId"
              placeholder="Enter tasklist"
              type="select"
              icon={
                <Feather
                  name="list"
                  size={24}
                  color={isDarkMode ? "white" : "black"}
                />
              }
              options={[
                {
                  label: "Add New Tasklist",
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
          </View>
        </View>
        <NBTextInput
          form={form}
          name="dueDate"
          placeholder="Enter due date"
          type="date"
          icon={
            <Feather
              name="calendar"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          }
        />
        <NBTextInput
          form={form}
          name="responsibleUserId"
          placeholder="Enter assigned RM"
          type="select"
          icon={
            <Feather
              name="user"
              size={24}
              color={isDarkMode ? "white" : "black"}
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
          placeholder="Enter client"
          type="select"
          icon={
            <Feather
              name="briefcase"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          }
          options={[
            {
              label: "Add New Client",
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
        <NBTextInput
          form={form}
          name="priorityId"
          placeholder="Enter priority"
          type="select"
          icon={
            <Feather
              name="star"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          }
          options={props.priorities.map((priority) => ({
            label: priority.name,
            value: priority.id,
          }))}
        />
        <NBButton
          text="Create Task"
          onPress={handleSubmit(onSubmit)}
          isPending={formState.isSubmitting || isPending}
        />
      </View>
    </ScrollView>
  );
};

export default AddTaskForm;

const styles = StyleSheet.create({
  darkContainer: {
    backgroundColor: "#000",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    margin: 16,
    padding: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    alignSelf: "flex-start",
  },
  formContent: {
    gap: 16,
  },
  taskListContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
