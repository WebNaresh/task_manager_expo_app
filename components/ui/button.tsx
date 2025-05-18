import { disabled_color, primary_color, text_color } from "@/constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type NBButtonProps = {
  isPending: boolean;
  text: string;
  onPress: () => void;
  type?: "primary" | "secondary";
  isDisabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const NBButton = (props: NBButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.loginButton,
        (props.isPending || props.isDisabled) && styles.disabledButton,
        props.style,
      ]}
      disabled={props.isPending || props.isDisabled}
      onPress={props.onPress}
    >
      {props.isPending ? (
        <ActivityIndicator size="small" color={text_color} />
      ) : (
        <Text style={[styles.loginButtonText, props.textStyle]}>
          {props.text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default NBButton;

const styles = StyleSheet.create({
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: disabled_color,
  },
  loginButtonText: {
    color: text_color,
    fontSize: 16,
    fontWeight: "600",
  },
});
