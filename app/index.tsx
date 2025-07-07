"use client";

import useAuth from "@/hooks/useAuth";
import { useStableAuth } from "@/hooks/useStableAuth";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Path, Svg } from "react-native-svg";

const { width } = Dimensions.get("window");

const features = [
  {
    id: "1",
    title: "Organize Tasks",
    description:
      "Easily create and manage your daily tasks with our intuitive interface",
    icon: (
      <Svg
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#007AFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </Svg>
    ),
  },
  {
    id: "2",
    title: "Set Priorities",
    description:
      "Focus on what matters most by organizing tasks based on importance",
    icon: (
      <Svg
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#007AFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <Path d="M22 4 12 14.01l-3-3" />
      </Svg>
    ),
  },
  {
    id: "3",
    title: "Track Progress",
    description:
      "Monitor your achievements and stay motivated with visual progress tracking",
    icon: (
      <Svg
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#007AFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M12 20v-6M6 20V10M18 20V4" />
      </Svg>
    ),
  },
];

const OnboardingItem = ({ item }: { item: any }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View
      style={[styles.itemContainer, isDarkMode && styles.itemContainerDark]}
    >
      <View style={[styles.featureCard, isDarkMode && styles.featureCardDark]}>
        <View
          style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}
        >
          {item.icon}
        </View>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          {item.title}
        </Text>
        <Text
          style={[styles.description, isDarkMode && styles.descriptionDark]}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);
  const { token, user } = useAuth();
  const stableAuth = useStableAuth();
  const router = useRouter();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNextSlide = () => {
    if (currentIndex < features.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      setIsRedirecting(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < features.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else if (currentIndex === features.length - 1) {
        clearInterval(interval);
        setIsRedirecting(true);
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Use stable auth as fallback if main auth fails
  const hasValidAuth =
    (token !== null && user) || (stableAuth.isAuthenticated && stableAuth.user);
  const currentUser = user || stableAuth.user;

  if (hasValidAuth && currentUser) {
    console.log("Index page: Valid auth found, redirecting", {
      role: currentUser.role,
      authSource: user ? "useAuth" : "stableAuth",
    });

    if (currentUser.role === "ADMIN") {
      return <Redirect href={"/(admin)/dashboard"} />;
    } else {
      return <Redirect href="/(manager)/dashboard" />;
    }
  }

  return (
    <LinearGradient
      colors={isDarkMode ? ["#181c24", "#23272f"] : ["#e0e7ff", "#fff"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.containerDark]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.headerText, isDarkMode && styles.headerTextDark]}
          >
            Glory Prime
          </Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={features}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={{ justifyContent: "center" }}
          initialScrollIndex={0}
        />

        <View style={styles.bottomContainer}>
          <View style={styles.paginationContainer}>
            {features.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive,
                  isDarkMode &&
                    index === currentIndex &&
                    styles.paginationDotActiveDark,
                ]}
              />
            ))}
          </View>

          {isRedirecting ? (
            <View style={styles.redirectingContainer}>
              <ActivityIndicator color={isDarkMode ? "#a5b4fc" : "#007AFF"} />
              <Text
                style={[
                  styles.redirectingText,
                  isDarkMode && styles.redirectingTextDark,
                ]}
              >
                Redirecting to login...
              </Text>
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.nextButton, isDarkMode && styles.nextButtonDark]}
                onPress={handleNextSlide}
              >
                <Text
                  style={[
                    styles.nextButtonText,
                    isDarkMode && styles.nextButtonTextDark,
                  ]}
                >
                  {currentIndex === features.length - 1 ? "Finish" : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  containerDark: {
    backgroundColor: "transparent",
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 40,
    letterSpacing: 1,
  },
  headerTextDark: {
    color: "#a5b4fc",
    ...(Platform.OS === "web"
      ? { textShadow: "0px 2px 4px rgba(165, 180, 252, 0.3)" }
      : {
          textShadowColor: "rgba(165, 180, 252, 0.3)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4,
        }),
  },
  itemContainer: {
    width,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  itemContainerDark: {
    backgroundColor: "transparent",
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 8,
        }),
    marginBottom: 40,
    width: width * 0.85,
    transform: [{ scale: 1 }],
  },
  featureCardDark: {
    backgroundColor: "#23272f",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.3)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
        }),
    borderColor: "rgba(165, 180, 252, 0.1)",
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 20,
  },
  iconContainerDark: {
    backgroundColor: "rgba(165, 180, 252, 0.1)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1a1a1a",
  },
  titleDark: {
    color: "#a5b4fc",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  descriptionDark: {
    color: "#b0b8c9",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#007AFF",
    width: 24,
    borderRadius: 8,
  },
  paginationDotActiveDark: {
    backgroundColor: "#a5b4fc",
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 15,
  },
  nextButton: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  nextButtonDark: {
    backgroundColor: "rgba(165, 180, 252, 0.1)",
  },
  nextButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  nextButtonTextDark: {
    color: "#a5b4fc",
  },
  getStartedButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 4px 12px rgba(0, 122, 255, 0.2)" }
      : {
          shadowColor: "#007AFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 4,
        }),
  },
  getStartedButtonDark: {
    backgroundColor: "#a5b4fc",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 4px 12px rgba(165, 180, 252, 0.2)" }
      : {
          shadowColor: "#a5b4fc",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
        }),
  },
  getStartedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  getStartedTextDark: {
    color: "#23272f",
  },
  redirectingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  redirectingText: {
    marginLeft: 8,
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  redirectingTextDark: {
    color: "#a5b4fc",
  },
});
