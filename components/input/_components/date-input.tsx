import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { NBTextInputProps } from "../text-input";

const NBDateInputField = (props: NBTextInputProps) => {
  const [show, setShow] = useState(false);
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
      ...(Platform.OS === "web"
        ? {
            boxShadow: isFocused
              ? "0px 2px 8px rgba(0, 122, 255, 0.18)"
              : "0px 2px 4px rgba(0, 122, 255, 0.08)",
          }
        : {
            shadowColor: isDarkMode ? "#000" : "#007AFF",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isFocused ? 0.18 : 0.08,
            shadowRadius: isFocused ? 8 : 4,
            elevation: isFocused ? 4 : 2,
          }),
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
  });

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShow(false);
    if (selectedDate) {
      props.form.setValue(props.name, selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <Controller
      name={props.name}
      control={props.form.control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShow(true)}>
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
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                handleDateChange(event, date);
                onChange(date?.toISOString().split("T")[0]);
              }}
            />
          )}
          <View style={styles.errorContainer}>
            <Text style={dynamicStyles.errorText}>
              {props.form.formState.errors[props.name]?.message?.toString()}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

export default NBDateInputField;

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
});
