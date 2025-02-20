import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { NBTextInputProps } from "../text-input";

const NBTextAreaInputField = (props: NBTextInputProps) => {
  return (
    <Controller
      name={props.name}
      control={props.form.control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View
              style={{
                paddingTop: 8,
              }}
            >
              {props.icon}
            </View>
            <TextInput
              style={styles.input}
              placeholder={props.placeholder}
              placeholderTextColor="#A0A0A0"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline={true}
              numberOfLines={8}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              height: "auto",
              width: "100%",
              overflow: "hidden",
              marginHorizontal: 16,
            }}
          >
            <Text style={styles.errorText}>
              {props.form.formState.errors[props.name]?.message?.toString()}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

export default NBTextAreaInputField;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 12,
    textAlignVertical: "top",
    height: 100,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    height: 20,
  },
});
