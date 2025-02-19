import { primary_color, text_color } from "@/constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type NBButtonProps = {
  isPending: boolean;
  text: string;
  onPress: () => void;
  type?: "primary" | "secondary";
};

const NBButton = (props: NBButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.loginButton}
      disabled={props.isPending}
      onPress={props.onPress}
    >
      {props.isPending ? (
        <ActivityIndicator size="small" color={text_color} />
      ) : (
        <Text style={styles.loginButtonText}>{props.text}</Text>
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
  loginButtonText: {
    color: text_color,
    fontSize: 16,
    fontWeight: "600",
  },
});
