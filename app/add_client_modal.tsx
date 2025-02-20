import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { error_color, success_color } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
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
  name: z.string().min(1),
  email: z.string().email(),
});

type form_type = z.infer<typeof form_schema>;

const AddClientModal = () => {
  const form = useForm<form_type>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      name: "",
      email: "",
    },
    reValidateMode: "onChange",
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: form_type) => {
      // /api/v1/client
      const response = await axios.post("/api/v1/client", data);
      console.log(`🚀 ~ response:`, response.data);
      return response.data;
    },
    async onSuccess(data, variables, context) {
      await queryClient?.invalidateQueries({
        queryKey: ["clients"],
      });
      Toast.show(`Client added`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });
      router.back();
    },
    onError(error, variables, context) {
      console.log(`🚀 ~ error:`, error);
      if (axios.isAxiosError(error)) {
        const message = error?.response?.data?.message;
        if (message) {
          Toast.show(message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: error_color,
          });
        }
      }
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: form_type) => {
    console.log(data);
    mutate(data);
  };

  return (
    <NBModal>
      <View style={{ padding: 20 }}>
        <NBTextInput
          form={form}
          name="name"
          placeholder="Enter name"
          type="text"
          icon={<Ionicons name="person" size={24} color="black" />}
        />
        <NBTextInput
          form={form}
          name="email"
          placeholder="Enter email"
          type="text"
          icon={<Ionicons name="mail" size={24} color="black" />}
        />
        <NBButton
          onPress={handleSubmit(onSubmit)}
          text="Add Client"
          isPending={isPending}
        />
      </View>
    </NBModal>
  );
};

export default AddClientModal;

const styles = StyleSheet.create({});
