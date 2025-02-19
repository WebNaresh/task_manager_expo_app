import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
} from "react-native-reanimated";

type NBModalProps = {
  children: React.ReactNode;
  href: Href;
};

export default function NBModal(props: NBModalProps) {
  const router = useRouter();
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut} // Add exiting animation
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000040",
      }}
    >
      {/* <Link href={props.href as any} asChild> */}
      <Pressable
        onPress={() => {
          router.back();
        }}
        style={StyleSheet.absoluteFill}
      />
      {/* </Link> */}
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutUp} // Add exiting animation
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
