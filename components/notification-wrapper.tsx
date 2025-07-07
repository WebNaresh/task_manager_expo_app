import useAuth from "@/hooks/useAuth";
import { useStableAuth } from "@/hooks/useStableAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { AppState } from "react-native";

type Props = {
  children: React.ReactNode;
};

const NotificationWrapper = (props: Props) => {
  const { user, token, isFetching } = useAuth();
  const stableAuth = useStableAuth();

  // Use stable auth as fallback if main auth fails
  const currentUser = user || stableAuth.user;
  const hasAuth =
    (!!token && !!user) || (!!stableAuth.token && !!stableAuth.user);

  console.log("user", currentUser?.id);
  console.log("notification wrapper auth state", {
    hasUser: !!currentUser,
    hasToken: !!token || !!stableAuth.token,
    isFetching: isFetching || stableAuth.isLoading,
    userRole: currentUser?.role,
    authSource: user ? "useAuth" : stableAuth.user ? "stableAuth" : "none",
  });

  const { mutate } = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      if (!currentUser?.id) {
        console.log("Skipping user status update - no user id");
        return { message: "No user id available" };
      }

      console.log("updating user status", data);
      const response = await axios.put(
        `/api/v1/auth/update-user-status/${currentUser.id}`,
        data
      );

      return response.data;
    },
  });

  const { data: _data } = useQuery({
    queryKey: [currentUser?.id],
    queryFn: async () => {
      console.log("querying with user id:", currentUser?.id);
      if (currentUser?.id) {
        mutate({ isActive: true });
      } else {
        console.log("Skipping mutation - no user id");
      }
      // query_client.refetchQueries();

      return { isActive: true };
    },
    enabled: !!currentUser?.id && (!!token || !!stableAuth.token),
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
