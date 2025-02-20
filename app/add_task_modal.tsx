import { AntDesign, Feather } from "@expo/vector-icons"; // Using Expo icons
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function TaskCreateScreen() {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState("KYC Approval");
  const [assignedRM, setAssignedRM] = useState("Sarah Chen");
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateTask = () => {
    // Handle task creation logic here
    console.log({
      taskTitle,
      description,
      selectedTask,
      assignedRM,
      dueDate,
      selectedClient,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tasklist</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedTask}
              onValueChange={(itemValue) => setSelectedTask(itemValue)}
            >
              <Picker.Item label="KYC Approval" value="KYC Approval" />
              {/* Add more task options here */}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task list</Text>
          <TextInput
            style={styles.input}
            value="KYC Approval"
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assigned RM</Text>
          <TextInput style={styles.input} value={assignedRM} editable={false} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>
              {dueDate ? dueDate.toLocaleDateString() : "Select date and time"}
            </Text>
            <AntDesign name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Client</Text>
          <TouchableOpacity style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>Select Client</Text>
            <Feather name="users" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTask}
        >
          <Text style={styles.createButtonText}>Create Task</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#666",
  },
  createButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
