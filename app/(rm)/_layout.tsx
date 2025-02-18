import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/ui/rm/header";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons name="dashboard" color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons name="dashboard" color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rm/index"
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons name="dashboard" color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons name="dashboard" color={props.color} />
          ),
        }}
      />
    </Tabs>
  );
}
