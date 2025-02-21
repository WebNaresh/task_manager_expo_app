import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
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

const TaskListModal = () => {
  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const router = useRouter();
  const query_client = useQueryClient();

  // mutation for /api/v1/tasklist
  const { handleSubmit } = form;
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Form) => {
      const response = await axios.post("/api/v1/tasklist", data);
      console.log(`🚀 ~ response:`, response);
      return response.data;
    },
    async onSuccess(data, variables, context) {
      console.log(data);
      router.back();
      Toast.show("Task List Added", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });
      await query_client.invalidateQueries({
        queryKey: ["tasklist"],
      });
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
        Toast.show(error.response?.data.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          backgroundColor: error_color,
        });
      }
    },
  });
  console.log(`🚀 ~ isPending:`, isPending);

  return (
    <NBModal>
      <View
        style={{
          padding: 20,
          backgroundColor: "white",
          borderRadius: 10,
          width: "100%",
        }}
      >
        <NBTextInput
          placeholder="Enter Name"
          form={form}
          name="name"
          type="text"
          icon={
            <Feather
              name="list"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
          }
        />
        <NBTextInput
          placeholder="Enter Description"
          form={form}
          name="description"
          type="text"
          icon={
            <Feather
              name="align-left"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
          }
        />
        <NBButton
          text="Add Task List"
          onPress={onSubmit}
          isPending={form.formState.isSubmitting || isPending}
          isDisabled={!form.formState.isDirty}
        />
      </View>
    </NBModal>
  );
};

export default TaskListModal;

const styles = StyleSheet.create({});
