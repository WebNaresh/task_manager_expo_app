import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { NBTextInputProps } from "../text-input";

const NBSelectInputField = (props: NBTextInputProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const dynamicStyles = StyleSheet.create({
    inputWrapper: {
      backgroundColor: isDarkMode ? "#333333" : "#F5F5F5",
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
      render={({ field: { onChange, value } }) => (
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
            {props.icon}
            <Picker
              selectedValue={value}
              style={[styles.input, dynamicStyles.input]}
              onValueChange={onChange}
              dropdownIconColor={isDarkMode ? "#FFFFFF" : "#000000"}
              itemStyle={{
                backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
              }} // Changed this line
            >
              <Picker.Item label={props.placeholder} value="" enabled={false} />
              {props.options?.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
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

export default NBSelectInputField;

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
