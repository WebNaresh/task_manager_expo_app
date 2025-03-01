import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { error_color, success_color } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View, useColorScheme } from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  number: z
    .string()
    .transform((v) => parseInt(v))
    .refine((v) => !isNaN(v) && v >= 1 && v <= 10, {
      message: "Number must be between 1 and 10",
    }),
  color: z.string().min(1),
  name: z.string().min(1),
});

type form_type = z.infer<typeof form_schema>;

export default function PriorityForm() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const query_client = useQueryClient();

  const form = useForm<form_type>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      number: 0,
      color: "#4B6BFB",
      name: "",
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit } = form;

  const mutation = useMutation({
    mutationFn: async (data: form_type) => {
      const response = await axios.post("/api/v1/priority", data);
      return response.data;
    },
    onSuccess(data, variables, context) {
      Toast.show(`Priority added`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });

      query_client.invalidateQueries({
        queryKey: ["priority"],
      });

      router.back();
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error)) {
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

  const onSubmit = (data: form_type) => {
    mutation.mutate(data);
  };

  return (
    <NBModal>
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <NBTextInput
          name="name"
          form={form}
          icon={
            <Ionicons
              name="flag-outline"
              size={20}
              color={isDarkMode ? "#ccc" : "#666"}
              style={styles.icon}
            />
          }
          placeholder="Priority Name"
          type="text"
        />
        <NBTextInput
          name="number"
          form={form}
          keyboardType="number-pad"
          icon={
            <Ionicons
              name="stats-chart-outline"
              size={20}
              color={isDarkMode ? "#ccc" : "#666"}
              style={styles.icon}
            />
          }
          placeholder="Priority Count"
          type="text"
        />
        <NBTextInput
          name="color"
          form={form}
          icon={
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={isDarkMode ? "#ccc" : "#666"}
              style={styles.icon}
            />
          }
          placeholder="Color"
          type="color"
        />
        <NBButton
          onPress={handleSubmit(onSubmit)}
          isPending={mutation.isPending}
          text="Add Priority"
        />
      </View>
    </NBModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e2e2",
  },
  inputContainerDark: {
    backgroundColor: "#444",
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: "black",
  },
  inputDark: {
    color: "white",
  },
  button: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
