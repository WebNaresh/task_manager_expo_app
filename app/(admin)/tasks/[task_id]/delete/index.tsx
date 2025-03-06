import NBModal from "@/components/ui/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
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

const DeleteModal = () => {
  const { task_id } = useLocalSearchParams<{
    user_id: string;
    task_id: string;
  }>();
  const router = useRouter();
  const query_client = useQueryClient();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const textColor = isDarkMode ? "#ffffff" : "#000000";
  const dangerColor = "#ff4040";
  const cancelBgColor = isDarkMode ? "#333333" : "#e0e0e0";

  // /api/v1/task/{id}

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios(`/api/v1/task/${task_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: async () => {
      Toast.show("Task deleted successfully", {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.LONG,
      });
      await query_client?.invalidateQueries({
        queryKey: ["tasks"],
      });
      router.navigate("/(admin)/tasks");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      // Alert.alert("Error", "Failed to delete task. Please try again.");
      if (isAxiosError(error)) {
        Toast.show(error.response?.data.message, {
          position: Toast.positions.BOTTOM,
          duration: Toast.durations.LONG,
        });
      }
    },
  });

  const handleDelete = async () => {
    try {
      mutate();

      // Navigate back after successful deletion
      router.back();

      // Optionally show success message
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task. Please try again.");
    } finally {
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <NBModal>
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#121212" : "#fff" },
        ]}
      >
        <Text style={[styles.title, { color: textColor }]}>Delete Task</Text>

        <Text style={[styles.message, { color: textColor }]}>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: cancelBgColor }]}
            onPress={handleCancel}
            disabled={isPending}
          >
            <Text style={[styles.buttonText, { color: textColor }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.deleteButton,
              { backgroundColor: dangerColor },
            ]}
            onPress={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </NBModal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    minWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#ff4040",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});
