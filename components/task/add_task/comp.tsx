import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  task_title: z
    .string()
    .trim()
    .min(3, { message: "Task title must be at least 3 characters long" }),
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters long" }),
  tasklist: z
    .string()
    .trim()
    .min(3, { message: "Tasklist must be at least 3 characters long" }),
  assigned_rm: z
    .string()
    .trim()
    .min(3, { message: "Assigned RM must be at least 3 characters long" }),
  due_date: z
    .string()
    .trim()
    .min(3, { message: "Due date must be at least 3 characters long" }),
  client: z
    .string()
    .trim()
    .min(3, { message: "Client must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

type Props = {
  clients: any[];
  managers: any[];
  tasklists: any[];
};

const AddTaskForm = (props: Props) => {
  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
  });

  const { handleSubmit, formState, watch, reset } = form;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setRefreshing(false);
  }, [reset]);

  const onSubmit = (data: Form) => {
    console.log(data);
  };

  const { mutate } = useMutation({
    mutationFn: async (data: Form) => {
      //  axios request here /api/v1/task
      const response = await axios.post("/api/v1/task", data);
      return response.data;
    },
    onSuccess(data, variables, context) {
      console.log(`🚀 ~ data:`, data);
      Toast.show("Task created successfully", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: success_color,
      });
    },
    onError(error, variables, context) {
      if (isAxiosError(error)) {
        console.error(`🚀 ~ error.response.data:`, error?.response?.data);
        Toast.show(error?.response?.data?.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: error_color,
        });
      }
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 26 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <NBTextInput
        form={form}
        name="task_title"
        placeholder="Enter task title"
        type="text"
        icon={<Feather name="clipboard" size={24} color="black" />}
      />
      <NBTextInput
        form={form}
        name="description"
        placeholder="Enter description"
        type="textarea"
        icon={<Feather name="file-text" size={24} color="black" />}
      />
      <NBTextInput
        form={form}
        name="tasklist"
        placeholder="Enter tasklist"
        type="select"
        icon={<Feather name="list" size={24} color="black" />}
        options={props.tasklists.map((tasklist) => ({
          label: tasklist.name,
          value: tasklist.id,
        }))}
      />
      <NBTextInput
        form={form}
        name="due_date"
        placeholder="Enter due date"
        type="date"
        icon={<Feather name="calendar" size={24} color="black" />}
      />
      <NBTextInput
        form={form}
        name="assigned_rm"
        placeholder="Enter assigned RM"
        type="select"
        icon={<Feather name="user" size={24} color="black" />}
        options={props.managers.map((manager) => ({
          label: manager.name,
          value: manager.id,
        }))}
      />
      <NBTextInput
        form={form}
        name="client"
        placeholder="Enter client"
        type="select"
        icon={<Feather name="briefcase" size={24} color="black" />}
        options={props.clients.map((client) => ({
          label: client.name,
          value: client.id,
        }))}
      />
      <NBButton
        text="Create Task"
        onPress={handleSubmit(onSubmit)}
        isPending={formState.isSubmitting}
      />
    </ScrollView>
  );
};

export default AddTaskForm;

const styles = StyleSheet.create({});
