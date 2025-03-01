import useAuth from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { AppState } from "react-native";

type Props = {
  children: React.ReactNode;
};

const NotificationWrapper = (props: Props) => {
  const { user } = useAuth();
  console.log("user", user?.id);

  const { mutate } = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      console.log("updating user status", data);
      const response = await axios.put(
        `/api/v1/auth/update-user-status/${user?.id}`,
        data
      );

      return response.data;
    },
  });

  const { data: _data } = useQuery({
    queryKey: [user?.id],
    queryFn: async () => {
      console.log("querying");
      mutate({ isActive: true });
      // query_client.refetchQueries();

      return { isActive: true };
    },
    enabled: user?.id !== null,
  });
  AppState.addEventListener("change", (nextAppState) => {
    console.log(`🚀 ~ nextAppState:`, nextAppState);
    if (nextAppState === "active") {
      // query_client.refetchQueries();
      mutate({ isActive: true });
    } else {
      mutate({ isActive: false });
    }
  });
  return <>{props.children}</>;
};

export default NotificationWrapper;
