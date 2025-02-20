import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { NBTextInputProps } from "../text-input";

const NBSelectInputField = (props: NBTextInputProps) => {
  return (
    <Controller
      name={props.name}
      control={props.form.control}
      render={({ field: { onChange, value } }) => (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            {props.icon}
            <Picker
              selectedValue={value}
              style={styles.input}
              onValueChange={onChange}
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

export default NBSelectInputField;

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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    height: 20,
  },
});
