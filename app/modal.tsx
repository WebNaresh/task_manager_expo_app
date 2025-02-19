import PriorityForm from "@/components/ui/rm/priority-form";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function Modal() {
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000040",
      }}
    >
      <Link href={"/"} asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>
      <Animated.View
        entering={SlideInDown}
        style={{
          width: "90%",
          backgroundColor: "white",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <PriorityForm />
      </Animated.View>
    </Animated.View>
  );
}
