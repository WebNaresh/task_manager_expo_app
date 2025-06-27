"use client";

import { primary_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

const ClientList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/client");
      return response.data;
    },
    initialData: [],
  });

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter(
      (client: any) =>
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      {/* Search Header */}
      <View
        style={[
          styles.searchContainer,
          isDarkMode && styles.darkSearchContainer,
        ]}
      >
        <View
          style={[
            styles.searchInputContainer,
            isDarkMode && styles.darkSearchInputContainer,
          ]}
        >
          <Feather
            name="search"
            size={20}
            color={isDarkMode ? "#ccc" : "#666"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            placeholder="Search clients by name or email..."
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Feather
                name="x"
                size={18}
                color={isDarkMode ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
        {filteredClients.map((client: any) => {
          const progress = Math.floor(
            (client?.assignedTasks?.filter(
              (task: any) => task?.status === "COMPLETED"
            )?.length ?? 0 / client?.assignedTasks?.length) * 100
          );
          return (
            <View
              key={client.id}
              style={[styles.clientCard, isDarkMode && styles.darkClientCard]}
            >
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
                  <Text
                    style={[
                      styles.clientName,
                      isDarkMode && styles.darkClientName,
                    ]}
                  >
                    {client.name}
                  </Text>
                  <Text
                    style={[
                      styles.clientTitle,
                      isDarkMode && styles.darkClientTitle,
                    ]}
                  >
                    {client.email}
                  </Text>
                </View>
                <View style={styles.rightContent}></View>
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
  clientCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  darkClientCard: {
    borderBottomColor: "#333",
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
  darkClientName: {
    color: "#fff",
  },
  clientTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  darkClientTitle: {
    color: "#ccc",
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  darkSearchContainer: {
    backgroundColor: "#000",
    borderBottomColor: "#333",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  darkSearchInputContainer: {
    backgroundColor: "#1a1a1a",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 4,
  },
  darkSearchInput: {
    color: "#fff",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default ClientList;
