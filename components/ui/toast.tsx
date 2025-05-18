import { Platform, StyleSheet } from "react-native";
import Toast, { ToastOptions } from "react-native-root-toast";

// Custom toast function to handle cross-platform toast styling
export const showToast = (message: string, options?: ToastOptions) => {
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

  return Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
    shadow: Platform.OS !== "web", // Disable shadow on web to avoid warnings
    animation: true,
    hideOnPress: true,
    containerStyle: customStyles.toastContainer,
    ...options,
  });
};

export default showToast;
