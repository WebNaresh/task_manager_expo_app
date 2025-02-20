"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

const { width } = Dimensions.get("window");

interface SkeletonItemProps {
  height: number;
  width: number;
  marginBottom: number;
}

const TaskCreateScreenSkeleton: React.FC = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnimation]);

  const getShimmerStyle = (): Animated.AnimatedProps<ViewStyle> => {
    const translateX = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    return {
      transform: [{ translateX }],
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    };
  };

  const SkeletonItem: React.FC<SkeletonItemProps> = ({
    height,
    marginBottom,
  }) => (
    <View style={[styles.skeletonItem, { height, marginBottom }]}>
      <Animated.View style={[StyleSheet.absoluteFill, getShimmerStyle()]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SkeletonItem height={40} width={width} marginBottom={16} />
      <SkeletonItem height={100} width={width} marginBottom={16} />
      <SkeletonItem height={50} width={width} marginBottom={16} />
      <SkeletonItem height={40} width={width} marginBottom={16} />
      <SkeletonItem height={40} width={width} marginBottom={16} />
      <SkeletonItem height={40} width={width} marginBottom={16} />
      <SkeletonItem height={40} width={width} marginBottom={16} />
      <SkeletonItem height={50} width={width} marginBottom={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    width: "100%",
  },
  skeletonItem: {
    backgroundColor: "#E1E9EE",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default TaskCreateScreenSkeleton;
