import { Tabs } from "expo-router";
import React from "react";

import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/ui/rm/header";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: (props) => (
            <MaterialIcons name="dashboard" size={16} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          title: "Tasks",
          tabBarIcon: (props) => (
            <FontAwesome5 name="tasks" size={16} color={props.color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: (props) => (
            <Feather name="user" size={16} color={props.color} />
          ),
        }}
      />
    </Tabs>
  );
}
