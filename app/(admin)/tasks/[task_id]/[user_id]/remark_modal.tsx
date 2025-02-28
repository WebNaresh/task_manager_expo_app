import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View, useColorScheme } from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters long" }),
  userId: z
    .string()
    .trim()
    .min(3, { message: "User must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

const RemarkModal = () => {
  const { user_id, task_id } = useLocalSearchParams<{
    user_id: string;
    task_id: string;
  }>();
  console.log(`🚀 ~ task_id:`, task_id);

  console.log(`🚀 ~ user_id:`, user_id);

  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      description: "",
      userId: user_id,
    },
  });

  const { handleSubmit } = form;
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Form) => {
      // axios request to /api/v1/task/{id}/remark
      const response = await axios.post(`/api/v1/task/${task_id}/remark`, data);
      return response.data;
    },
    onSuccess(data, variables, context) {
      console.log(`🚀 ~ data:`, data);
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
      console.log(`🚀 ~ error:`, error);
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

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <NBModal>
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#121212" : "#fff" },
        ]}
      >
        <NBTextInput
          type="textarea"
          placeholder="Type your remark here"
          form={form}
          name="description"
          icon={
            <Feather
              name="message-circle"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          }
        />
        <NBButton
          text="Add Remark"
          onPress={onSubmit}
          isPending={form.formState.isSubmitting || isPending}
        />
      </View>
    </NBModal>
  );
};

export default RemarkModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
