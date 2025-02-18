import { Feather } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { NBTextInputProps } from "../text-input";

const NBPasswordInputField = (props: NBTextInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
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
              placeholder="Pass@123"
              placeholderTextColor="#A0A0A0"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
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
  eyeIcon: {
    padding: 4,
  },
});
