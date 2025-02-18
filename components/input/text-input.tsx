import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import NBPasswordInputField from "./_components/password-input";

export type NBTextInputProps = {
  form: UseFormReturn<any, any>;
  name: string;
  placeholder: string;
  keyboardType?: "email-address" | "default";
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  icon: React.ReactNode;
  type: "text" | "password";
};

const NBTextInput = (props: NBTextInputProps) => {
  if (props.type === "password") {
    return <NBPasswordInputField {...props} />;
  }
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
              keyboardType={props.keyboardType}
              autoCapitalize={props.autoCapitalize}
            />
          </View>
          {/* show errors if exist */}
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

export default NBTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    gap: 4,
    marginBottom: 16,
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
    height: 16,
  },
});
