import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import NBColorInput from "./_components/color-input";
import NBDateInputField from "./_components/date-input"; // Import the new date input component
import NBPasswordInputField from "./_components/password-input";
import NBSelectInputField from "./_components/select-input";
import NBTextAreaInputField from "./_components/text-area-input";

export type NBTextInputProps = {
  form: UseFormReturn<any, any>;
  name: string;
  placeholder: string;
  keyboardType?: "email-address" | "default" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  icon: React.ReactNode;
  type: "text" | "password" | "color" | "select" | "textarea" | "date"; // Add date type
  options?: { label: string; value: string }[]; // Add options for select type
  onSelect?: (value: string) => void;
};

const NBTextInput = (props: NBTextInputProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [isFocused, setIsFocused] = React.useState(false);

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
    },
    input: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    errorText: {
      color: "#e53935",
      fontWeight: "600",
      fontSize: 13,
      marginTop: 2,
    },
  });

  if (props.type === "password") {
    return <NBPasswordInputField {...props} />;
  }

  if (props.type === "color") {
    return <NBColorInput {...props} />;
  }

  if (props.type === "select") {
    if (!props.options) {
      return null; // TypeScript will catch this error
    }
    return <NBSelectInputField {...props} />;
  }

  if (props.type === "textarea") {
    return <NBTextAreaInputField {...props} />;
  }

  if (props.type === "date") {
    return <NBDateInputField {...props} />;
  }

  return (
    <Controller
      name={props.name}
      control={props.form.control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputWrapper,
              dynamicStyles.inputWrapper,
              isFocused && { borderColor: isDarkMode ? "#a5b4fc" : "#007AFF" },
            ]}
          >
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

export default NBTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    marginBottom: 2,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: 17,
    marginLeft: 12,
    fontWeight: "500",
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
