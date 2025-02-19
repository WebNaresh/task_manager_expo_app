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
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const from_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

type form_schema_types = z.infer<typeof from_schema>;

const Modal = () => {
  const form = useForm<form_schema_types>({
    resolver: zodResolver(from_schema),
    defaultValues: {
      name: "Naresh",
      email: "email@gmail.com",
      password: "pass@123",
    },
    reValidateMode: "onChange",
  });
  const router = useRouter();

  const queryClient = useQueryClient();

  const { handleSubmit } = form;

  const onSubmit = (data: form_schema_types) => {
    console.log(data);
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: form_schema_types) => {
      // axios request to  /api/v1/admin/create-rm

      const response = await axios.post("/api/v1/admin/create-rm", data);
      return response.data;
    },
    async onSuccess(data, variables, context) {
      console.log(`🚀 ~ data:`, data);
      await queryClient?.invalidateQueries({
        queryKey: ["managers"],
      });
      Toast.show(`RM added`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });
      router.push("/(admin)/index/manager");
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error)) {
        console.log(`🚀 ~ error:`, error.response?.data?.message);
        Toast.show(error.response?.data?.message, {
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

  return (
    <NBModal>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Add RM
        </Text>
        <NBTextInput
          form={form}
          name="name"
          placeholder="Name"
          icon={<Ionicons name="person" size={24} color="black" />}
          type="text"
        />
        <NBTextInput
          form={form}
          name="email"
          placeholder="Email"
          icon={<Ionicons name="mail" size={24} color="black" />}
          type="text"
        />
        <NBTextInput
          form={form}
          name="password"
          placeholder="Password"
          icon={<Ionicons name="lock-closed" size={24} color="black" />}
          type="password"
        />
        <NBButton
          text="Login"
          isPending={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </NBModal>
  );
};

export default Modal;

const styles = StyleSheet.create({});
