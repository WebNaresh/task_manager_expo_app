import { Redirect, Tabs } from "expo-router";
import React from "react";

import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/ui/rm/header";

export default function TabLayout() {
  const { getItem } = useAsyncStorage("token");
  const fetchToken = async () => {
    const storedToken = await getItem();
    return storedToken ? storedToken : null;
  };

  const { data, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: fetchToken,
  });
  if (data === null) {
    return <Redirect href={"/login"} />;
  }
  if (isFetching) {
    return null;
  }

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
            <FontAwesome5 name="tasks" size={16} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="manager/index"
        options={{
          title: "RM",
          tabBarIcon: (props) => (
            <FontAwesome5 name="users" size={16} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: (props) => (
            <Feather name="user" size={16} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
