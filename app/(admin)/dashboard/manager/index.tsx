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
  useColorScheme,
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

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
  );
};

const RelationshipManagersList = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/admin/rms");
      return response.data;
    },
    initialData: [],
  });

  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[primary_color]}
          />
        }
      >
        {data.map((manager: any) => {
          const progress = Math.min(
            Math.floor(
              (manager?.assignedTasks?.filter(
                (task: any) => task?.status === "COMPLETED"
              )?.length ?? 0 / manager?.assignedTasks?.length) * 100
            ),
            100
          );
          return (
            <View
              key={manager.id}
              style={[styles.managerCard, isDarkMode && styles.darkManagerCard]}
            >
              <View style={styles.managerInfo}>
                <Image
                  source={{
                    uri:
                      manager.image ??
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.managerName,
                      isDarkMode && styles.darkManagerName,
                    ]}
                  >
                    {manager.name}
                  </Text>
                  <Text
                    style={[
                      styles.managerTitle,
                      isDarkMode && styles.darkManagerTitle,
                    ]}
                  >
                    {manager.email}
                  </Text>
                  <Text style={[styles.tasks, isDarkMode && styles.darkTasks]}>
                    {manager?.assignedTasks?.length} Tasks
                  </Text>
                  <ProgressBar percentage={progress} />
                </View>
                <View style={styles.rightContent}>
                  <StatusBadge status={manager.isActive} />
                  <Text
                    style={[
                      styles.percentage,
                      isDarkMode && styles.darkPercentage,
                    ]}
                  >
                    {progress} %
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <Link href={"/add_rm_modal"} asChild>
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
  darkContainer: {
    backgroundColor: "#000",
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
  managerCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  darkManagerCard: {
    borderBottomColor: "#333",
  },
  managerInfo: {
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
  managerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  darkManagerName: {
    color: "#fff",
  },
  managerTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  darkManagerTitle: {
    color: "#ccc",
  },
  tasks: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  darkTasks: {
    color: "#ccc",
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
  darkPercentage: {
    color: "#ccc",
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

export default RelationshipManagersList;
