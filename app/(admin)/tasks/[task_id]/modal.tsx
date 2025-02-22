import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
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
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  console.log(`🚀 ~ user_id:`, user_id);

  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      description: "",
      userId: user_id,
    },
  });

  return (
    <NBModal>
      <NBTextInput
        type="textarea"
        placeholder="Type your remark here"
        form={form}
        name="description"
        icon={<Feather name="message-circle" size={24} color="black" />}
      />
      <NBButton
        text="Add Remark"
        onPress={form.handleSubmit((data) => {
          console.log(`🚀 ~ data:`, data);
        })}
        isPending={form.formState.isSubmitting}
      />
    </NBModal>
  );
};

export default RemarkModal;

const styles = StyleSheet.create({});
