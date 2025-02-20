import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { z } from "zod";

const form_schema = z.object({
  name: z.string(),
  description: z.string(),
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

  return (
    <NBModal>
      <View>
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
          onPress={form.handleSubmit((data) => {
            console.log(data);
          })}
          isPending={form.formState.isSubmitting}
        />
      </View>
    </NBModal>
  );
};

export default TaskListModal;

const styles = StyleSheet.create({});
