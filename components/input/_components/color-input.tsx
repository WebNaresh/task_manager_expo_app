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
          <View style={styles.inputWrapper}>
            {props.icon}
            <TextInput
              style={styles.input}
              placeholder={props.placeholder}
              placeholderTextColor="#A0A0A0"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
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
            <Text style={styles.errorText}>
              {props.form.formState.errors[props.name]?.message?.toString()}
            </Text>
          </View>

          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select profile color</Text>

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
                  style={styles.confirmButton}
                  onPress={() => {
                    onChange(selectedColor);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.confirmText}>Confirm</Text>
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
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
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
    color: "red",
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
    backgroundColor: "white",
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
    backgroundColor: "#4B6BFB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
