//  <Text
// style={{
//   backgroundColor: "#ff3b30",
//   color: "#fff",
//   paddingHorizontal: 10,
//   paddingVertical: 2,
//   borderRadius: 10,
//   fontSize: 12,
// }}
//                   >
// {item.priority}
// </Text>

import { Ionicons } from "@expo/vector-icons";

import {
  getAllEmployeeDetails,
  getMimeType,
  getUserDetails,
} from "@/components/utils/api";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card } from "react-native-paper";
import Toast from "react-native-toast-message";
import { withDrawer } from "./drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  TaskManangementLest: undefined;
};
function TaskManangementLest() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [followUpToDelete, setFollowUpToDelete] = useState<string | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterData, setFilterData] = useState({
    emp: "",
    status: "",
  });
  const [user, setUser] = useState<any>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const openFileExternally = (uri: string, mimeType: string) => {
    Linking.openURL(uri);
  };

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [emp, setEmp] = useState([]);

  const renderMenu = (item: any) => (
    <Modal
      transparent={true}
      visible={selectedItem === item.task_man_id && menuVisible}
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer2}>
          {[
            {
              label: "Edit",
              emoji: "✏️",
              onPress: () => {
                setMenuVisible(false);
                router.push({
                  pathname: "/(components)/taskManagement",
                  params: { type: "update", id: item.task_man_id },
                });
              },
            },
            {
              label: "Delete",
              emoji: "🗑️",
              onPress: () => {
                setMenuVisible(false);
                setFollowUpToDelete(item.task_man_id);
                setDeleteModalVisible(true);
              },
            },
          ].map((menuItem) => (
            <TouchableOpacity
              key={menuItem.label}
              style={styles.menuItem2}
              activeOpacity={0.7}
              onPress={menuItem.onPress}
            >
              <View style={styles.menuItemRow2}>
                <Text style={styles.menuEmoji}>{menuItem.emoji}</Text>
                <Text style={styles.menuText}>{menuItem.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://crmclient.trinitysoftwares.in/crmAppApi/taskManagement.php?type=getAllTasks"
      );
      const json = await response.json();

      if (json.status === "success") {
        setTasks(json.tasks);
      } else {
        Toast.show({ type: "error", text1: "Failed to fetch follow-ups" });
      }
    } catch (error) {
      console.error("API Error:", error);
      Toast.show({ type: "error", text1: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (taskId: string) => {
    try {
      const response = await fetch(
        "http://crmclient.trinitysoftwares.in/crmAppApi/taskManagement.php?type=deleteTask",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task_man_id: taskId }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        Toast.show({ type: "success", text1: "Deleted successfully" });
        setDeleteModalVisible(false);
        fetchTasks();
      } else {
        Toast.show({ type: "error", text1: result.message || "Delete failed" });
      }
    } catch (error) {
      console.error("Delete error:", error);
      Toast.show({ type: "error", text1: "Something went wrong!" });
    }
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      const result = await getAllEmployeeDetails();
      if (result.status === "success") {
        setEmp(result.data);
      } else {
        console.error("Error:", result.message);
      }
    };

    fetchEmployee();
  }, []);
  const [error, setError] = useState("");

  const applyFilter = async () => {
    try {
      setLoading(true);

      const payload: any = {
        emp_id: filterData.emp,
        status: filterData.status,
      };

      if (fromDate) {
        payload.from_date = fromDate.toISOString().split("T")[0];
      }
      if (toDate) {
        payload.to_date = toDate.toISOString().split("T")[0];
      }

      const response = await axios.post(
        "http://crmclient.trinitysoftwares.in/crmAppApi/taskManagement.php?type=getFilteredTasks",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        console.log("response.data.tasks", response.data.tasks);
        setTasks(response.data.tasks);
        setFilterModalVisible(false);
      } else {
        setError("Failed to filter leads");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No data found for selected filters",
        });
      }
    } catch (error) {
      console.error("❌ Error filtering leads:", error);
      setError("Error filtering leads");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong while applying filters",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const payload = {
        task_man_id: selectedTask.task_man_id,
        status: selectedStatus,
        loginid: user.userid,
      };

      const response = await axios.post(
        "http://crmclient.trinitysoftwares.in/crmAppApi/taskManagement.php?type=updateTaskStatus",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Status updated successfully",
        });
        setStatusModalVisible(false);
        fetchTasks();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message,
        });
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong while updating status",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserIdAndDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        const result = await getUserDetails(id);
        if (result.success) setUser(result.user);
        else setError(result.message);
      } else {
        setError("No user ID found in storage.");
      }
    } catch {
      setError("Failed to load user data.");
    }
  };

  useEffect(() => {
    fetchUserIdAndDetails();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5975D9" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Management List</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Search by name"
          style={[styles.searchInput, { flex: 1 }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={styles.filterIcon}
        >
          <Ionicons name="filter" size={24} color="#4b3ba9" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterContainer}>
            {/* Close Icon */}
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={styles.modalCloseIcon}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Apply Filters</Text>

            <Text style={styles.dateLabel}>Employee</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filterData.emp}
                onValueChange={(itemValue) =>
                  setFilterData({ ...filterData, emp: itemValue })
                }
                style={{ padding: 0, margin: -5 }}
              >
                <Picker.Item label="--Select--" value="" />
                {emp?.map((item: any) => (
                  <Picker.Item
                    key={item?.emp_id}
                    label={item?.emp_name}
                    value={item?.emp_id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.dateLabel}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filterData.status}
                onValueChange={(itemValue) =>
                  setFilterData({ ...filterData, status: itemValue })
                }
                style={{ padding: 0, margin: -5 }}
              >
                <Picker.Item label="--Select Status--" value="" />
                <Picker.Item label="Complete" value="complete" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Hold" value="hold" />
                <Picker.Item label="Cancle" value="cancle" />
              </Picker>
            </View>
            {/* From Date Picker */}
            <Text style={styles.dateLabel}>From Date</Text>
            <TouchableOpacity
              onPress={() => setShowFromPicker(true)}
              style={styles.dateField}
            >
              <Text style={styles.dateValue}>
                {" "}
                {fromDate ? formatDate(fromDate) : "Select Date"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateLabel}>To Date</Text>
            {/* To Date Picker */}
            <TouchableOpacity
              onPress={() => setShowToPicker(true)}
              style={styles.dateField}
            >
              <Text style={styles.dateValue}>
                {" "}
                {toDate ? formatDate(toDate) : "Select Date"}
              </Text>
            </TouchableOpacity>
            {showFromPicker && (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowFromPicker(Platform.OS === "ios");
                  if (selectedDate) setFromDate(selectedDate);
                }}
              />
            )}

            {showToPicker && (
              <DateTimePicker
                value={toDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowToPicker(Platform.OS === "ios");
                  if (selectedDate) setToDate(selectedDate);
                }}
              />
            )}

            {/* Buttons */}
            <View style={styles.filterButtonsRow}>
              <Button
                mode="contained"
                style={styles.searchBtn}
                onPress={() => {
                  applyFilter();
                  setFilterModalVisible(false);
                }}
              >
                Search
              </Button>
              <Button
                mode="outlined"
                style={styles.resetBtn}
                onPress={() => {
                  setFilterData({ emp: "", status: "" });
                }}
              >
                Reset
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ paddingBottom: 200 }}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.task_man_id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View>
                <View style={styles.cardHeader}>
                  <View style={styles.iconTitleWrapper}>
                    <FontAwesome5
                      name="user-circle"
                      size={24}
                      color="#1F40B5"
                    />
                    <Text style={styles.cardTitle}>#000{item.task_man_id}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item.task_man_id);
                      setMenuVisible(true);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#888" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Task Date</Text>
                  <Text style={styles.cardValue}>{item.task_date}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Ionicons name="time-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Task Time</Text>
                  <Text style={styles.cardValue}>{item.task_time}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Task End Date</Text>
                  <Text style={styles.cardValue}>{item.task_end_date}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Ionicons name="time-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Task End Time</Text>
                  <Text style={styles.cardValue}>{item.task_end_time}</Text>
                </View>
                <View style={styles.cardDetailRow}>
                  <Ionicons name="time-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Assigned to</Text>
                  <Text style={styles.cardValue}>{item.emp_name}</Text>
                </View>
                <View
                  style={[
                    styles.cardDetailRow,
                    { alignItems: "center", justifyContent: "flex-start" },
                  ]}
                >
                  <Ionicons name="document-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel2}>Document</Text>
                  <View style={{ flex: 1 }}>
                    {item.document_url ? (
                      item.document_url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <TouchableOpacity
                          onPress={() => setPreviewUri(item.document_url)}
                        >
                          <Text
                            style={[
                              styles.cardValue2,
                              { backgroundColor: "#1F40B5" },
                            ]}
                          >
                            View Image
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            openFileExternally(
                              item.document_url,
                              getMimeType(item.document_url)
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.cardValue2,
                              { backgroundColor: "#1F40B5" },
                            ]}
                          >
                            Open Document
                          </Text>
                        </TouchableOpacity>
                      )
                    ) : (
                      <Text style={{ color: "#888" }}>No document</Text>
                    )}
                  </View>
                </View>

                <View style={styles.cardDetailRow}>
                  <Ionicons
                    name="person-circle-outline"
                    size={16}
                    color="#4B65E9"
                  />
                  <Text style={styles.cardLabel}>Created By</Text>
                  <Text
                    style={[styles.cardValue, { flex: 1 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.createdby_name} on {item.createdate}
                  </Text>
                </View>
                <View style={styles.cardDetailRow}>
                  <FontAwesome5 name="handshake" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Description</Text>
                  <Text
                    style={[styles.cardValue, { flex: 1 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.cardDetailRow,
                    { alignItems: "center", justifyContent: "flex-start" },
                  ]}
                >
                  <Ionicons name="flag-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel2}>Priority</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.cardValue2,
                        {
                          backgroundColor:
                            item.priority === "medium"
                              ? "#FFC107"
                              : item.priority === "high"
                                ? "#9C27B0"
                                : item.priority === "low"
                                  ? "#299cdb"
                                  : "#ccc",
                        },
                      ]}
                    >
                      {item.priority}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.cardDetailRow,
                    { alignItems: "center", justifyContent: "flex-start" },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#4B65E9"
                  />
                  <Text style={styles.cardLabel2}>Status</Text>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTask(item);
                      setSelectedStatus(item.status);
                      setStatusModalVisible(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.cardValue2,
                        {
                          backgroundColor:
                            item.status === "completed"
                              ? "#4CAF50"
                              : item.status === "pending"
                                ? "#FFC107"
                                : item.status === "hold"
                                  ? "#9C27B0"
                                  : item.status === "cancel"
                                    ? "#F44336"
                                    : "#ccc",
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {renderMenu(item)}
            </Card>
          )}
            initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        />
      </View>
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterContainer}>
            <Text style={styles.modalTitle}>Update Task Status</Text>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              >
                <Picker.Item label="Complete" value="completed" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Hold" value="hold" />
                <Picker.Item label="Cancel" value="cancel" />
              </Picker>
            </View>
            <View style={styles.filterButtonsRow}>
              <Button
                mode="outlined"
                onPress={() => setStatusModalVisible(false)}
                style={styles.resetBtn}
              >
                Close
              </Button>
              <Button
                mode="contained"
                onPress={handleStatusChange}
                style={styles.searchBtn}
              >
                Save Changes
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!previewUri}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUri(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setPreviewUri(null)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {previewUri && (
            <Image
              source={{ uri: previewUri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Confirm Delete
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#444",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Are you sure you want to delete this follow-up?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#ccc",
                  padding: 10,
                  borderRadius: 8,
                  marginRight: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (followUpToDelete) {
                    handleConfirmDelete(followUpToDelete);
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#e74c3c",
                  padding: 10,
                  borderRadius: 8,
                  marginLeft: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(components)/taskManagement")}
      >
        <Text style={styles.createButtonText}>Task Management</Text>
      </TouchableOpacity>
    </View>
  );
}

export default withDrawer(TaskManangementLest, "TaskManangementLest");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fe",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#004c91",
    padding: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: "#1F40B5",
    marginLeft: 10,
    fontWeight: "600",
  },
  cardDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
    paddingVertical: 2,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  cardLabel: {
    color: "#4B65E9",
    fontWeight: "600",
    marginLeft: 6,
    width: "40%",
  },
  cardLabel2: {
    color: "#4B65E9",
    fontWeight: "600",
    marginLeft: 6,
    marginTop: 4,
    width: "40%",
    alignSelf: "flex-start",
  },
  cardValue: {
    color: "#222",
    fontWeight: "500",
    fontSize: 14,
    width: "60%",
  },

  cardValue2: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  createButton: {
    backgroundColor: "#112980",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginHorizontal: 10,
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    width: 280,
    maxHeight: 400,
  },

  menuItem: {
    paddingVertical: 5,
  },

  filterIcon: {
    marginLeft: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },

  filterContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    width: "90%",
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  filterButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  searchBtn: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#4b3ba9",
  },

  resetBtn: {
    flex: 1,
    borderColor: "#4b3ba9",
  },

  alertButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },

  dateField: {
    backgroundColor: "#f0f0ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#4B65E9",
  },
  dateLabel: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },
  dateValue: {
    fontSize: 16,

    marginTop: 4,
  },
  modalCloseIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  pickerWrapper: {
    backgroundColor: "#f0f0ff",
    borderWidth: 0.5,
    borderColor: "#4B65E9",
    borderRadius: 8,
    marginVertical: 8,
    padding: -10,
  },
  menuContainer2: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    elevation: 10,
    width: 320,
    maxHeight: 450,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  menuItem2: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  menuItemRow2: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuEmoji: {
    fontSize: 20,
    marginRight: 12,
  },

  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  docButton: {
    padding: 3,
    backgroundColor: "#1F40B5",
    borderRadius: 6,
    alignItems: "center",
    marginTop: 4,
  },
  docButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
