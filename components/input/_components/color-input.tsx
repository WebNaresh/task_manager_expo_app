import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { NBTextInputProps } from "../text-input";

const COLORS = [
  "#4B6BFB",
  "#DC2626",
  "#16A34A",
  "#FF4D4D",
  "#F97316",
  "#FFA500",
  "#FFC0CB",
  "#64748B",
  "#1E40AF",
  "#4C1D95",
  "#44403C",
  "#1F2937",
];

const NBColorInput = (props: NBTextInputProps) => {
  const [selectedColor, setSelectedColor] = useState("#4B6BFB");
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [isFocused, setIsFocused] = useState(false);

  const dynamicStyles = StyleSheet.create({
    inputWrapper: {
      backgroundColor: isDarkMode ? "#23272f" : "#F5F5F5",
      borderColor: isFocused
        ? isDarkMode
          ? "#a5b4fc"
          : "#007AFF"
        : isDarkMode
        ? "#333a4d"
        : "#e0e7ef",
      borderWidth: 1.5,
      shadowColor: isDarkMode ? "#000" : "#007AFF",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isFocused ? 0.18 : 0.08,
      shadowRadius: isFocused ? 8 : 4,
      elevation: isFocused ? 4 : 2,
      borderRadius: 16,
      paddingHorizontal: 18,
      height: 56,
      marginBottom: 2,
    },
    input: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    errorText: {
      color: "red",
    },
    modalContent: {
      backgroundColor: isDarkMode ? "#333333" : "white",
    },
    modalTitle: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    confirmButton: {
      backgroundColor: isDarkMode ? "#4B6BFB" : "#4B6BFB",
    },
    confirmText: {
      color: isDarkMode ? "#FFFFFF" : "#FFFFFF",
    },
  });

  const handleColorSelect = (color: string, onChange: any) => {
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <Controller
      name={props.name}
      control={props.form.control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
            {props.icon}
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder={props.placeholder}
              placeholderTextColor="#A0A0A0"
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onFocus={() => setIsFocused(true)}
              keyboardType={props.keyboardType}
              autoCapitalize={props.autoCapitalize}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={[
                styles.colorPreview,
                { backgroundColor: value || selectedColor },
              ]}
            />
          </View>
          <View style={styles.errorContainer}>
            <Text style={dynamicStyles.errorText}>
              {props.form.formState.errors[props.name]?.message?.toString()}
            </Text>
          </View>

          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            >
              <View style={[styles.modalContent, dynamicStyles.modalContent]}>
                <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
                  Select profile color
                </Text>

                <View style={styles.previewContainer}>
                  <View
                    style={[
                      styles.avatarPreview,
                      { backgroundColor: selectedColor },
                    ]}
                  >
                    <Text style={styles.avatarText}>MB</Text>
                  </View>
                </View>

                <View style={styles.colorGrid}>
                  {COLORS.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.colorOption, { backgroundColor: color }]}
                      onPress={() => handleColorSelect(color, onChange)}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.confirmButton, dynamicStyles.confirmButton]}
                  onPress={() => {
                    onChange(selectedColor);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.confirmText, dynamicStyles.confirmText]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
      )}
    />
  );
};

export default NBColorInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: "row",
    height: "auto",
    width: "100%",
    overflow: "hidden",
    marginHorizontal: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarPreview: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  confirmButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
