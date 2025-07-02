import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import { withDrawer } from "../(components)/drawer";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import axios from "axios";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import {
  getAllUserDetails,
  getLeadAgents,
  getStateDetails,
  getUserDetails,
} from "@/components/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  NewLeads: undefined;
};

type Lead = {
  cust_no: string;
  name: string; // Maps to leadName
  email_id: string;
  contact_no: string;
  whatsapp_no: string;
  state_name: string;  
  state_id: string;
  company_name: string; // Maps to amount
  address: string; // Maps to notes
  type: string; // Will be "lead"
  lead_status: string;
  lead_owner: string;
  lead_id: string;
};

function NewLeadsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterData, setFilterData] = useState({
    agent: "",
    user: "",
    state: "",
  });

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [leadss, setLeadss] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // Filter leads based on search query (case-insensitive)
  const filteredLeads = leadss?.filter((lead: any) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<null | string>(null);

  const deleteLead = async (id: string) => {
    try {
      const response = await axios.delete(
        "http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=deleteCustomer",
        {
          data: { id },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: " Customer deleted successfully",
        });

        fetchLeads();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
          text2: "Failed to delete lead",
        });
      }
    } catch (error) {
      console.error("❌ Error deleting lead:", error);
      Toast.show({
        type: "error",
        text1: " Error occurred while deleting lead",
      });
    }
  };

  const renderMenu = (item: Lead) => (
    <Modal
      transparent={true}
      visible={selectedItem === item.lead_id && menuVisible}
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
              label: "View",
              emoji: "👁️",
              onPress: () =>
                router.push({
                  pathname: "/(components)/customerDetails",
                  params: { id: item.lead_id },
                }),
            },

            {
              label: "Edit",
              emoji: "✏️",
              onPress: () =>
                router.push({
                  pathname: "/(components)/customerProfile",
                  params: { type: "update", id: item.lead_id },
                }),
            },
            {
              label: "WhatsApp Chat",
              emoji: "💬",
              onPress: () => {
                const phone = item.whatsapp_no;
                const url = `https://wa.me/${phone}`;

                Linking.canOpenURL(url)
                  .then((supported) => {
                    if (supported) {
                      Linking.openURL(url);
                    } else {
                      Alert.alert("WhatsApp not installed");
                    }
                  })
                  .catch((err) =>
                    console.error("Error opening WhatsApp:", err)
                  );
              },
            },
            {
              label: "Call",
              emoji: "📞",
              onPress: () => {
                const phone = item.contact_no;
                const telURL = `tel:${phone}`;
                Linking.openURL(telURL); // open phone dialer
              },
            },
            {
              label: "Delete",
              emoji: "🗑️",
              onPress: () => {
                setLeadToDelete(item.lead_id);
                setDeleteModalVisible(true);
              },
            },
          ].map((menuItem) => (
            <TouchableOpacity
              key={menuItem.label}
              style={styles.menuItem2}
              activeOpacity={0.7}
              onPress={() => {
                setMenuVisible(false);
                menuItem.onPress();
              }}
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

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchUserIdAndDetails = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          const result = await getUserDetails(id);
          if (result.success) {
            setUser(result.user);
          } else {
            setError(result.message);
          }
        } else {
          setError("No user ID found in storage.");
        }
      } catch (err: any) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndDetails();
  }, []);

  useEffect(() => {
    if (user?.userid) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=getAllCustomers&loginid=${user.userid}`
      );

      if (response.data.status === "success") {
        const leads = response.data.customers;
        setLeadss(leads);
      } else {
        setError("Failed to load leads");
      }
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      setError("Error fetching leads");
    } finally {
      setLoading(false);
    }
  };

  const [states, setStates] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);

      const [stateRes, agentRes, userRes] = await Promise.all([
        getStateDetails(),
        getLeadAgents(),
        getAllUserDetails(),
      ]);

      if (stateRes.status === "success") {
        setStates(stateRes.sateData);
      } else {
        console.warn("State error:", stateRes.message);
      }

      if (userRes.status === "success") {
        setAllUser(userRes.users);
      } else {
        console.warn("State error:", stateRes.message);
      }

      if (agentRes.status === "success") {
        setAgents(agentRes.leadAgent);
      } else {
        console.warn("Lead Agent error:", agentRes.message);
      }

      setLoading(false);
    };

    fetchDropdownData();
  }, []);

  const applyFilter = async () => {
    try {
      setLoading(true);

      const url = `http://crmclient.trinitysoftwares.in/crmAppApi/leads.php?type=getFilteredLeads&${
        filterData.agent ? `&agent_id=${filterData.agent}` : ""
      }${filterData.user ? `&loginid=${filterData.user}` : ""}${
        filterData.state ? `&state_id=${filterData.state}` : ""
      }&from_date=${fromDate.toISOString().split("T")[0]}&to_date=${
        toDate.toISOString().split("T")[0]
      }`;

      const response = await axios.get(url);

      if (response.data.status === "success") {
        setLeadss(response.data.leads);
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
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Customer List</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
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

            {/* Agent Picker */}
            <Text style={styles.dateLabel}>Agent</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filterData.agent}
                onValueChange={(itemValue) =>
                  setFilterData({ ...filterData, agent: itemValue })
                }
                style={{ padding: 0, margin: -5 }}
              >
                <Picker.Item label="-- Select State --" value="" />
                {agents?.map((item: any) => (
                  <Picker.Item
                    key={item?.agent_id}
                    label={item?.agent_name}
                    value={item?.agent_id}
                  />
                ))}
              </Picker>
            </View>

            {/* User Picker */}
            <Text style={styles.dateLabel}>User</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filterData.user}
                onValueChange={(itemValue) =>
                  setFilterData({ ...filterData, user: itemValue })
                }
                style={{ padding: 0, margin: -5 }}
              >
                <Picker.Item label="-- Select State --" value="" />
                {allUser?.map((item: any) => (
                  <Picker.Item
                    key={item?.userid}
                    label={item?.username}
                    value={item?.userid}
                  />
                ))}
              </Picker>
            </View>

            {/* State Picker */}
            <Text style={styles.dateLabel}>State</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filterData.state}
                onValueChange={(itemValue) =>
                  setFilterData({ ...filterData, state: itemValue })
                }
                style={{ padding: 0, margin: -5 }}
              >
                <Picker.Item label="-- Select State --" value="" />
                {states?.map((item: any) => (
                  <Picker.Item
                    key={item?.state_id}
                    label={item?.state_name}
                    value={item?.state_id}
                  />
                ))}
              </Picker>
            </View>
            {/* From Date Picker */}
            <Text style={styles.dateLabel}>From Date</Text>
            <TouchableOpacity
              onPress={() => setShowFromPicker(true)}
              style={styles.dateField}
            >
              <Text style={styles.dateValue}>{formatDate(fromDate)}</Text>
            </TouchableOpacity>
            <Text style={styles.dateLabel}>To Date</Text>
            {/* To Date Picker */}
            <TouchableOpacity
              onPress={() => setShowToPicker(true)}
              style={styles.dateField}
            >
              <Text style={styles.dateValue}>{formatDate(toDate)}</Text>
            </TouchableOpacity>
            {showFromPicker && (
              <DateTimePicker
                value={fromDate}
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
                value={toDate}
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
                  // TODO: Apply filter logic
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
                  setFilterData({ agent: "", user: "", state: "" });
                }}
              >
                Reset
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDeleteModalVisible(false)}
        >
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Confirm Deletion</Text>
            <Text style={styles.confirmMsg}>
              Are you sure you want to delete this lead?
            </Text>

            <View style={styles.confirmBtnContainer}>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.confirmBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#d9534f" }]}
                onPress={() => {
                  if (leadToDelete) {
                    deleteLead(leadToDelete);
                    setDeleteModalVisible(false);
                    setLeadToDelete(null);
                  }
                }}
              >
                <Text style={styles.confirmBtnText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.lead_id}
        renderItem={({ item, index }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Title
              title={`${index + 1}. #000${item.lead_id} ${item.name}`}
              right={() => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item.lead_id);
                    setMenuVisible(true);
                  }}
                >
                  <IconButton icon="dots-vertical" />
                </TouchableOpacity>
              )}
              titleStyle={{ color: "#4b3ba9" }}
            />
            <View style={styles.horizontalLine} />
            <Card.Content>
                {item.company_name ? (
                <View style={styles.row}>
                  <IconButton
                    icon="wallet-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>{item.company_name}</Text>
                </View>
              ) : null}
              <View style={styles.row}>
                <IconButton
                  icon="bookmark-outline"
                  size={18}
                  iconColor="#4b3ba9"
                />
                <Text>{item.email_id}</Text>
              </View>
              {item.contact_no ? (
                <View style={styles.row}>
                  <IconButton
                    icon="phone-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>{item.contact_no}</Text>
                </View>
              ) : null}
             
              {item.address ? (
                <View style={styles.row}>
                  <IconButton icon="calendar" size={18} iconColor="#4b3ba9" />
                  <Text>{item.address}</Text>
                </View>
              ) : null}
            </Card.Content>
            {selectedItem === item.lead_id && menuVisible && renderMenu(item)}
          </Card>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <Button
        icon="plus"
        mode="contained"
        style={styles.createButton}
        labelStyle={{ fontSize: 16 }}
        onPress={() =>
          router.push({
            pathname: "/(components)/customerProfile",
            params: { type: "create" },
          })
        }
      >
        Create Customer
      </Button>
    </View>
  );
}
export default withDrawer(NewLeadsScreen, "NewLeads");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edf1fd",
    paddingTop: 30,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    flex: 1,
    marginHorizontal: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#4b3ba9",
    marginHorizontal: 16,
    marginTop: -15,
    marginBottom: 4,
    opacity: 0.5,
  },
  card: {
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderColor: "#4b3ba9",
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -10,
  },
  createButton: {
    backgroundColor: "#001a72",
    borderRadius: 25,
    marginBottom: 40,
    paddingVertical: 2,
    alignSelf: "center",
    width: "90%",
    marginTop: 20,
  },
  pickerWrapper: {
    backgroundColor: "#f0f0ff",
    borderWidth: 0.5,
    borderColor: "#4B65E9",
    borderRadius: 8,
    marginVertical: 8,
    padding: -10,
  },

  modalCloseIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },

  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20, // increased padding
    borderRadius: 16,
    elevation: 8,
    width: 280, // increased width
    maxHeight: 400, // optional: in case items overflow
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

  filterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
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

  confirmModal: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmMsg: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  confirmBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
