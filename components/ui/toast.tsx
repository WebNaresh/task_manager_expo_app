import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";

export type ToastType = "success" | "error" | "info" | "warning";

interface EnhancedToastOptions extends ToastOptions {
  type?: ToastType;
}

interface ToastContentProps {
  message: string;
  type: ToastType;
  onClose?: () => void;
}

const ToastContent = ({
  message,
  type = "info",
  onClose,
}: ToastContentProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return {
          icon: <AntDesign name="checkcircleo" size={20} color="#fff" />,
          backgroundColor: "#10b981",
        };
      case "error":
        return {
          icon: <MaterialIcons name="error-outline" size={20} color="#fff" />,
          backgroundColor: "#ef4444",
        };
      case "warning":
        return {
          icon: <Ionicons name="warning-outline" size={20} color="#fff" />,
          backgroundColor: "#f59e0b",
        };
      case "info":
      default:
        return {
          icon: (
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#fff"
            />
          ),
          backgroundColor: "#3b82f6",
        };
    }
  };

  const { icon, backgroundColor } = getIconAndColor();

  return (
    <Animated.View
      style={[
        styles.contentContainer,
        { backgroundColor },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.messageText}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Feather name="x" size={18} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const showToast = (message: string, options?: EnhancedToastOptions) => {
  // Define platform-specific styles to avoid shadow warnings
  const customStyles = StyleSheet.create({
    toastContainer:
      Platform.OS === "web"
        ? {
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
          }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          },
  });

  // Map our type to backgroundColor if provided
  const type =
    options?.type ||
    (options?.backgroundColor === "#10b981" ||
    options?.backgroundColor === "#22c55e"
      ? "success"
      : options?.backgroundColor === "#ef4444" ||
        options?.backgroundColor === "#dc2626"
      ? "error"
      : options?.backgroundColor === "#f59e0b" ||
        options?.backgroundColor === "#eab308"
      ? "warning"
      : "info");

  let toastRef: Toast | null = null;

  const handleClose = () => {
    if (toastRef) {
      Toast.hide(toastRef);
    }
  };

  toastRef = Toast.show(
    // We have to pass a React element as the message
    // @ts-ignore - the types say it should be a string, but it works with elements too
    <ToastContent message={message} type={type} onClose={handleClose} />,
    {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM - 50,
      shadow: Platform.OS !== "web",
      animation: true,
      hideOnPress: true,
      containerStyle: [
        customStyles.toastContainer,
        {
          paddingHorizontal: 0,
          paddingVertical: 0,
          marginTop: Platform.OS === "ios" ? 50 : 20,
        },
      ],
      opacity: 1,
      ...options,
    }
  );

  return toastRef;
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "100%",
  },
  iconContainer: {
    marginRight: 12,
  },
  messageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  closeButton: {
    padding: 3,
    marginLeft: 8,
  },
});

export default showToast;
