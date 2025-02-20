import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
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

type Props = {};

const AddTaskForm = (props: Props) => {
  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
  });

  const { handleSubmit, formState } = form;

  const onSubmit = (data: Form) => {
    console.log(data);
  };
  return (
    <View>
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
        options={[
          { label: "KYC Approval", value: "KYC Approval" },
          { label: "Account Opening", value: "Account Opening" },
          { label: "Account Closure", value: "Account Closure" },
        ]}
      />
      <NBTextInput
        form={form}
        name="assigned_rm"
        placeholder="Enter assigned RM"
        type="text"
        icon={<Feather name="user" size={24} color="black" />}
      />
      <NBTextInput
        form={form}
        name="due_date"
        placeholder="Enter due date"
        type="text"
        icon={<Feather name="calendar" size={24} color="black" />}
      />
      <NBTextInput
        form={form}
        name="client"
        placeholder="Enter client"
        type="text"
        icon={<Feather name="briefcase" size={24} color="black" />}
      />
      <NBButton
        text="Create Task"
        onPress={handleSubmit(onSubmit)}
        isPending={formState.isSubmitting}
      />
    </View>
  );
};

export default AddTaskForm;

const styles = StyleSheet.create({});
