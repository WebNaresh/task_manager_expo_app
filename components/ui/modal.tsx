import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

type NBModalProps = {
  children: React.ReactNode;
  back_link: string;
};

export default function NBModal(props: NBModalProps) {
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
      <Link href={props.back_link as any} asChild>
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
        {props.children}
      </Animated.View>
    </Animated.View>
  );
}
