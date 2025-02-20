"use client";

import { primary_color } from "@/constants/Colors";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
import React from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const StatusBadge = ({ status }: { status: boolean }) => {
  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: status ? "#e8f5e9" : "#fff3e0" },
      ]}
    >
      <Text
        style={[styles.statusText, { color: status ? "#2e7d32" : "#f57c00" }]}
      >
        {status ? "Active" : "Inactive"}
      </Text>
    </View>
  );
};

const ClientList = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/client");
      return response.data;
    },
    initialData: [],
  });

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            colors={[primary_color]}
          />
        }
      >
        {data.map((client: any) => {
          const progress = Math.floor(
            (client?.assignedTasks?.filter(
              (task: any) => task?.status === "COMPLETED"
            )?.length ?? 0 / client?.assignedTasks?.length) * 100
          );
          return (
            <View key={client.id} style={styles.clientCard}>
              <View style={styles.clientInfo}>
                <Image
                  source={{
                    uri:
                      client.image ??
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientTitle}>{client.email}</Text>
                </View>
                <View style={styles.rightContent}>
                  <StatusBadge status={client.isActive} />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <Link href={"/add_client_modal"} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    color: "#2196f3",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  clientCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
  },
  clientTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  tasks: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  percentage: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginTop: 8,
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: primary_color,
    borderRadius: 2,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: primary_color,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default ClientList;
