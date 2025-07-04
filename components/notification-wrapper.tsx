import useAuth from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { AppState } from "react-native";

type Props = {
  children: React.ReactNode;
};

const NotificationWrapper = (props: Props) => {
  const { user, token, isFetching } = useAuth();
  console.log("user", user?.id);
  console.log("notification wrapper auth state", {
    hasUser: !!user,
    hasToken: !!token,
    isFetching,
    userRole: user?.role,
  });

  const { mutate } = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      if (!user?.id) {
        console.log("Skipping user status update - no user id");
        return { message: "No user id available" };
      }

      console.log("updating user status", data);
      const response = await axios.put(
        `/api/v1/auth/update-user-status/${user.id}`,
        data
      );

      return response.data;
    },
  });

  const { data: _data } = useQuery({
    queryKey: [user?.id],
    queryFn: async () => {
      console.log("querying with user id:", user?.id);
      if (user?.id) {
        mutate({ isActive: true });
      } else {
        console.log("Skipping mutation - no user id");
      }
      // query_client.refetchQueries();

      return { isActive: true };
    },
    enabled: !!user?.id && !!token,
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
