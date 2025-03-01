import { Task } from "@/app/(admin)/dashboard/tasklist";
import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  taskListId: z
    .string()
    .trim()
    .min(3, { message: "User must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

const RemarkModal = () => {
  const { user_id, task_id, task_list_id } = useLocalSearchParams<{
    user_id: string;
    task_id: string;
    task_list_id: string;
  }>();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["tasklist"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/tasklist");
      return response.data as Task[];
    },
    initialData: [],
  });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <NBModal>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        style={[styles.container, isDarkMode && styles.containerDark]}
      >
        <InputForm task_list_id={task_list_id} task_id={task_id} data={data} />
      </ScrollView>
    </NBModal>
  );
};

const InputForm = ({
  task_list_id,
  task_id,
  data,
}: {
  task_list_id: string;
  task_id: string;
  data: Task[];
}) => {
  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      taskListId: task_list_id,
    },
  });
  const query_client = useQueryClient();

  const {
    handleSubmit,
    formState: { isDirty },
    watch,
  } = form;

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Form) => {
      // axios request to /api/v1/task/{id}/remark
      const response = await axios.put(
        `/api/v1/task/${task_id}/tasklist`,
        data
      );
      return response.data;
    },
    async onSuccess(data, variables, context) {
      await query_client.invalidateQueries({
        queryKey: ["tasks"],
      });

      Toast.show("Remark added successfully", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: success_color,
      });
      router.back();
    },
    onError(error, variables, context) {
      Toast.show("Error adding remark", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: error_color,
      });
    },
  });
  return (
    <View>
      <NBTextInput
        type="select"
        placeholder="Select Task List"
        name="taskListId"
        form={form}
        options={data.map((task) => ({
          label: task.name,
          value: task?.id,
        }))}
        icon={<Feather name="list" size={24} color="black" />}
      />

      <NBButton
        text="Update List"
        onPress={onSubmit}
        isPending={form.formState.isSubmitting || isPending}
        isDisabled={!isDirty}
      />
    </View>
  );
};

export default RemarkModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "black",
  },
});
