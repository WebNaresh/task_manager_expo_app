import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
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
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

const EditTaskListModal = () => {
  const { task_list_id } = useLocalSearchParams<{ task_list_id: string }>();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["tasklist", task_list_id],
    queryFn: async () => {
      // /api/v1/tasklist/{id}
      const response = await axios.get(`/api/v1/tasklist/${task_list_id}`);
      return response.data;
    },
  });

  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  return (
    <NBModal>
      <ScrollView
        style={[{ padding: 20 }, isDarkMode && styles.darkScrollView]}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {data && <InputForm task_list_id={task_list_id} data={data} />}
      </ScrollView>
    </NBModal>
  );
};

export default EditTaskListModal;

const InputForm = ({
  task_list_id,
  data,
}: {
  task_list_id: string;
  data: any;
}) => {
  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      name: data?.name,
      description: data?.description,
    },
  });

  const queryClient = useQueryClient();

  const { handleSubmit } = form;
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Form) => {
      // axios request to /api/v1/tasklist/{id}
      const response = await axios.patch(
        `/api/v1/tasklist/${task_list_id}`,
        data
      );
      return response.data;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["tasklist", task_list_id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["tasklist"],
      });
      Toast.show("Task list updated successfully", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: success_color,
      });
      router.back();
    },
    onError(error) {
      if (isAxiosError(error)) {
        const message = error.response?.data.message;
        Toast.show(message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: error_color,
        });
      }
    },
  });

  return (
    <View>
      <NBTextInput
        placeholder="Enter task list name"
        form={form}
        name="name"
        type="text"
        icon={<Feather name="clipboard" size={24} color="black" />}
      />
      <NBTextInput
        placeholder="Enter task list description"
        form={form}
        name="description"
        type="textarea"
        icon={<Feather name="file-text" size={24} color="black" />}
      />
      <NBButton
        text="Update Task List"
        onPress={onSubmit}
        isPending={isPending}
        isDisabled={isPending || !form.formState.isDirty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  darkScrollView: {
    backgroundColor: "#000",
  },
});
