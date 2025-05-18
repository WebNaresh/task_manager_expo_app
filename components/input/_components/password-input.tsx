import { Feather } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { NBTextInputProps } from "../text-input";

const NBPasswordInputField = (props: NBTextInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

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
  });

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
              secureTextEntry={!showPassword}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onFocus={() => setIsFocused(true)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
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

export default NBPasswordInputField;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 16,
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
  eyeIcon: {
    padding: 4,
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
