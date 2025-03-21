import { Pressable, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
} from "react-native-reanimated";

type NBModalProps = {
  children: React.ReactNode;
  onClose?: () => void;
};

export default function NBModal(props: NBModalProps) {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#00000040",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Pressable onPress={props.onClose} style={StyleSheet.absoluteFill} />
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutUp}
        style={{
          width: "90%",
          backgroundColor: "white",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 1001,
        }}
      >
        {props.children}
      </Animated.View>
    </Animated.View>
  );
}
