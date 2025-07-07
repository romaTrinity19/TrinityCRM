import { getUserDetails } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import { withDrawer } from "../(components)/drawer";
import DateTimePicker from "@react-native-community/datetimepicker";

type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  NewLeads: undefined;
};

interface Opportunity {
  opp_create_id: string;
  opportunity_name: string;
  name: string;
  contact: string;
  whatsapp_no: string;
  estimated_amount: string;
  expected_date: string;
  prod_service_names: string[];
  notes?: string;
  opp_status?: string;
}

function NewLeadsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  const [createCustomerModalVisible, setCreateCustomerModalVisible] =
    useState(false);

  const [filterData, setFilterData] = useState({
    lead: "",
  });
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const states = ["State", "Madhya Pradesh", "Maharashtra", "Rajasthan"];

  const filteredLeads = opportunities?.filter((lead: any) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [leadToDelete, setLeadToDelete] = useState<null | string>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const deleteOportunity = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=deleteOpportunity&id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: " Opportunity deleted successfully",
        });

        if (user?.userid) {
          fetchOpportunities(user.userid);
        }
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

  const renderMenu = (item: any) => (
    <Modal
      transparent={true}
      visible={selectedItem === item.opp_create_id && menuVisible}
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
                  pathname: "/(components)/opportunityUserDetails",
                  params: { id: item.opp_create_id },
                }),
            },
            {
              label: "Transfer",
              emoji: "🔄",
              onPress: () => router.push("/(pages)/newLeads"),
            },
            {
              label: "Create Customer",
              emoji: "🧑‍💼",
              onPress: () => setCreateCustomerModalVisible(true),
            },
            {
              label: "Edit",
              emoji: "✏️",
              onPress: () =>
                router.push({
                  pathname: "/(components)/newOpportunity",
                  params: { type: "update", id: item.opp_create_id },
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
                setLeadToDelete(item.opp_create_id);
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

  const CreateCustomer = (item: any) => (
    <Modal
      visible={createCustomerModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setCreateCustomerModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>❗</Text>
          <Text style={styles.alertTitle}>Are you sure?</Text>
          <Text style={styles.alertMessage}>
            You won't be able to revert this!
          </Text>
          <View style={styles.alertButtons}>
            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: "#4b3ba9" }]}
              onPress={() => {
                setCreateCustomerModalVisible(false);
              }}
            >
              <Text style={styles.alertButtonText}>Yes!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: "#f23547" }]}
              onPress={() => setCreateCustomerModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const fetchOpportunities = async (userId: string) => {
    try {
      const response = await fetch(
        `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=getAllOpportunity&loginid=${userId}`
      );
      const json = await response.json();

      if (json.status === "success") {
        setOpportunities(json.opportunities);
      } else {
        setError(json.message || "Error fetching opportunities.");
      }
    } catch (err) {
      setError("Something went wrong while loading opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserIdAndOpportunities = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");

        if (id) {
          const result = await getUserDetails(id);
          if (result.success) {
            setUser(result.user);
            if (result.user.userid) {
              fetchOpportunities(result.user.userid); // 👈 Use extracted function
            } else {
              setError("User ID is missing in the user data.");
            }
          } else {
            setError(result.message || "Failed to fetch user details.");
          }
        } else {
          setError("No user ID found in storage.");
        }
      } catch (err) {
        setError("Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndOpportunities();
  }, []);

  const applyFilter = async () => {
    try {
      setLoading(true);

      const payload: any = {
        lead_id: filterData.lead,
      };

      if (fromDate) {
        payload.from_date = fromDate.toISOString().split("T")[0];
      }
      if (toDate) {
        payload.to_date = toDate.toISOString().split("T")[0];
      }

      const response = await axios.post(
        "http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=getFilteredOpportunity",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        setOpportunities(response.data.opportunities);
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

  useEffect(() => {
    if (user?.userid) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://crmclient.trinitysoftwares.in/crmAppApi/leads.php?type=getAllLeads&loginid=${user.userid}`
      );

      if (response.data.status === "success") {
        const leads = response.data.leads;
        setLeads(leads);
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5975D9" />
      </View>
    );
  }
  if (error) return <Text style={{ color: "red", padding: 10 }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Opportunity</Text>

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

            {/* State Picker */}
            <Text style={styles.dateLabel}>Lead</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filterData.lead}
                onValueChange={(itemValue) =>
                  setFilterData({ ...filterData, lead: itemValue })
                }
                style={{ padding: 0, margin: -5 }}
              >
                <Picker.Item label="-- Select Lead --" value="" />
                {leads?.map((item: any) => (
                  <Picker.Item
                    key={item?.lead_id}
                    label={`${item?.name}/${item?.lead_id}`}
                    value={item?.lead_id}
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
              <Text style={styles.dateValue}>
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
                  setFilterData({ lead: "" });
                  setFromDate(null);
                  setToDate(null);
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
                    deleteOportunity(leadToDelete);
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
        keyExtractor={(item) => item?.opp_create_id}
        renderItem={({ item, index }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Title
              title={`${index + 1}. #000${item.opp_create_id} ${item.name}`}
              right={() => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item.opp_create_id);
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
              {item.prod_service_names && item.prod_service_names.length > 0 ? (
                <View style={styles.row}>
                  <IconButton
                    icon="bookmark-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flex: 1 }}
                  >
                    {item.prod_service_names.join(", ")}
                  </Text>
                </View>
              ) : null}
              {item.contact ? (
                <View style={styles.row}>
                  <IconButton
                    icon="phone-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>{item.contact}</Text>
                  <Text>, {item.whatsapp_no}</Text>
                </View>
              ) : null}
              {item.estimated_amount ? (
                <View style={styles.row}>
                  <IconButton
                    icon="wallet-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>{item.estimated_amount}</Text>
                </View>
              ) : null}
              {item.expected_date ? (
                <View style={styles.row}>
                  <IconButton icon="calendar" size={18} iconColor="#4b3ba9" />
                  <Text>{item.expected_date}</Text>
                </View>
              ) : null}
            </Card.Content>
            {renderMenu(item)}
          </Card>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
      <CreateCustomer />
      <Button
        icon="plus"
        mode="contained"
        style={styles.createButton}
        labelStyle={{ fontSize: 16 }}
        onPress={() =>
          router.push({
            pathname: "/(components)/newOpportunity",
            params: { type: "create" },
          })
        }
      >
        Create Opportunity
      </Button>
    </View>
  );
}
export default withDrawer(NewLeadsScreen, "NewLeads");

const styles = StyleSheet.create({
  pickerWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
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
  alertBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: 300,
    alignItems: "center",
    elevation: 5,
  },
  alertIcon: {
    fontSize: 36,
    color: "#f0ad4e",
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  alertButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  alertButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
});
