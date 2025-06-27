import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { NBTextInputProps } from "../text-input";

interface Option {
  label: string;
  value: string;
}

const NBSelectInputField = (props: NBTextInputProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [isFocused, setIsFocused] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState<Option[]>(
    props.options || []
  );

  // Filter options based on search query
  React.useEffect(() => {
    if (!props.options) return;

    if (searchQuery.trim() === "") {
      setFilteredOptions(props.options);
    } else {
      const filtered = props.options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, props.options]);

  const getSelectedLabel = (value: string) => {
    const selectedOption = props.options?.find(
      (option) => option.value === value
    );
    return selectedOption?.label || props.placeholder || "Select an option";
  };

  const dynamicStyles = StyleSheet.create({
    inputWrapper: {
      backgroundColor: isDarkMode ? "#23272f" : "#F5F5F5",
      borderColor: isFocused
        ? isDarkMode
          ? "#a5b4fc"
          : "#007AFF"
        : isDarkMode
        ? "#333a4d"
        : "#e0e7ef",
      borderWidth: 1.5,
      ...(Platform.OS === "web"
        ? {
            boxShadow: isFocused
              ? "0px 2px 8px rgba(0, 122, 255, 0.18)"
              : "0px 2px 4px rgba(0, 122, 255, 0.08)",
          }
        : {
            shadowColor: isDarkMode ? "#000" : "#007AFF",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isFocused ? 0.18 : 0.08,
            shadowRadius: isFocused ? 8 : 4,
            elevation: isFocused ? 4 : 2,
          }),
      borderRadius: 16,
      paddingHorizontal: 18,
      height: 56,
      marginBottom: 2,
    },
    input: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
      flex: 1,
      fontSize: 16,
    },
    errorText: {
      color: "red",
    },
  });

  return (
    <Controller
      name={props.name}
      control={props.form.control}
      render={({ field: { onChange, value } }) => (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.inputWrapper, dynamicStyles.inputWrapper]}
            onPress={() => {
              setIsModalVisible(true);
              setIsFocused(true);
            }}
            activeOpacity={0.7}
          >
            {props.icon}
            <Text style={[dynamicStyles.input, { marginLeft: 12 }]}>
              {getSelectedLabel(value)}
            </Text>
            <Feather
              name="chevron-down"
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>

          {/* Modal for options */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setIsModalVisible(false);
              setIsFocused(false);
              setSearchQuery("");
            }}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                    maxHeight: Dimensions.get("window").height * 0.8,
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      },
                    ]}
                  >
                    {props.placeholder || "Select an option"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(false);
                      setIsFocused(false);
                      setSearchQuery("");
                    }}
                    style={styles.closeButton}
                  >
                    <Feather
                      name="x"
                      size={24}
                      color={isDarkMode ? "#FFFFFF" : "#000000"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View
                  style={[
                    styles.searchContainer,
                    {
                      backgroundColor: isDarkMode ? "#2a2a2a" : "#f5f5f5",
                      borderColor: isDarkMode ? "#333" : "#e0e0e0",
                    },
                  ]}
                >
                  <Feather
                    name="search"
                    size={20}
                    color={isDarkMode ? "#888" : "#666"}
                  />
                  <TextInput
                    style={[
                      styles.searchInput,
                      {
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      },
                    ]}
                    placeholder="Search options..."
                    placeholderTextColor={isDarkMode ? "#888" : "#666"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={false}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Feather
                        name="x-circle"
                        size={20}
                        color={isDarkMode ? "#888" : "#666"}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Options List */}
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value}
                  showsVerticalScrollIndicator={true}
                  style={styles.optionsList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        {
                          backgroundColor:
                            value === item.value
                              ? isDarkMode
                                ? "#3b82f6"
                                : "#e3f2fd"
                              : "transparent",
                          borderBottomColor: isDarkMode ? "#333" : "#e0e0e0",
                        },
                      ]}
                      onPress={() => {
                        onChange(item.value);
                        props.onSelect?.(item.value);
                        setIsModalVisible(false);
                        setIsFocused(false);
                        setSearchQuery("");
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color:
                              value === item.value
                                ? isDarkMode
                                  ? "#FFFFFF"
                                  : "#1976d2"
                                : isDarkMode
                                ? "#FFFFFF"
                                : "#000000",
                            fontWeight: value === item.value ? "600" : "normal",
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {value === item.value && (
                        <Feather
                          name="check"
                          size={20}
                          color={isDarkMode ? "#FFFFFF" : "#1976d2"}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                      <MaterialIcons
                        name="search-off"
                        size={48}
                        color={isDarkMode ? "#666" : "#ccc"}
                      />
                      <Text
                        style={[
                          styles.emptyText,
                          {
                            color: isDarkMode ? "#888" : "#666",
                          },
                        ]}
                      >
                        No options found
                      </Text>
                      <Text
                        style={[
                          styles.emptySubtext,
                          {
                            color: isDarkMode ? "#666" : "#999",
                          },
                        ]}
                      >
                        Try adjusting your search
                      </Text>
                    </View>
                  )}
                />
              </View>
            </SafeAreaView>
          </Modal>

          <View style={styles.errorContainer}>
            <Text style={dynamicStyles.errorText}>
              {props.form.formState.errors[props.name]?.message?.toString()}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

export default NBSelectInputField;

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  errorContainer: {
    flexDirection: "row",
    height: "auto",
    width: "100%",
    overflow: "hidden",
    marginHorizontal: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
});
