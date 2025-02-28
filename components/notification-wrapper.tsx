import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { AppState } from "react-native";

type Props = {
  children: React.ReactNode;
};

const NotificationWrapper = (props: Props) => {
  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      const response = await axios.put(
        `/api/v1/auth/update-user-status/${user?.id}`,
        data
      );
      return response.data;
    },
  });
  const query_client = useQueryClient();

  console.log(
    `🚀 ~ file: _layout.tsx ~ line 158 ~ RootLayoutNav ~ colorScheme`,
    AppState.addEventListener("change", (nextAppState) => {
      console.log("App State: ", nextAppState);
      if (nextAppState === "active") {
        query_client.refetchQueries();
        mutate({ isActive: true });
      } else {
        mutate({ isActive: false });
      }
    })
  );
  return <>{props.children}</>;
};

export default NotificationWrapper;
