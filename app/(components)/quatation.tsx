import { getUserDetails } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import { withDrawer } from "./drawer";

type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  Quatation: undefined;
};

function Quatation() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [quotations, setQuotations] = useState<any[]>([]);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [customer, setCustomer] = useState<any[]>([]);
  const [filterData, setFilterData] = useState({
    user: "",
  });
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [createCustomerModalVisible, setCreateCustomerModalVisible] =
    useState(false);
  const filteredQuotations = searchQuery
    ? quotations.filter((q) =>
        q.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quotations;

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const menuItems = [
    { label: "View", action: "view", emoji: "👁️" },
    { label: "Download", action: "download", emoji: "📥" },
    { label: "Create Invoice", modal: "createInvoice", emoji: "📑" },
    { label: "Edit", action: "edit", emoji: "✏️" },
    { label: "WhatsApp Chat", action: "whatsapp", emoji: "💬" },
    { label: "Call", action: "call", emoji: "📞" },
    { label: "Delete", action: "delete", emoji: "🗑️" },
  ];

  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<any>(null);

  const renderMenu = (item: any) => (
    <Modal
      transparent={true}
      visible={selectedItem === item.bill_id && menuVisible}
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer2}>
          {menuItems.map((menuItem) => (
            <TouchableOpacity
              key={menuItem.label}
              style={styles.menuItem2}
              activeOpacity={0.7}
              onPress={() => {
                setMenuVisible(false);

                if (menuItem.modal === "createInvoice") {
                  setCreateCustomerModalVisible(true);
                } else if (menuItem.action === "view") {
                  router.push({
                    pathname: "/(components)/quatationDetails",
                    params: { id: item.bill_id },
                  });
                } else if (menuItem.action === "download") {
                  downloadPDF(item.bill_id);
                } else if (menuItem.action === "edit") {
                  router.push({
                    pathname: "/(components)/quatationForm",
                    params: { id: item.bill_id, type: "update" },
                  });
                } else if (menuItem.action === "whatsapp") {
                  Linking.openURL(`whatsapp://send?phone=${item.whatsapp_no}`);
                } else if (menuItem.action === "call") {
                  Linking.openURL(`tel:${item.mobile_no}`);
                } else if (menuItem.action === "delete") {
                  setQuotationToDelete(item);
                  setDeleteConfirmVisible(true);
                }
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

  const handleDeleteQuotation = async () => {
    if (!quotationToDelete) return;

    try {
      const response = await axios.delete(
        "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=deleteQuotation",
        {
          data: { bill_id: quotationToDelete.bill_id },
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: "Deleted successfully",
        });
        // Remove from state
        setQuotations((prev) =>
          prev.filter((q) => q.bill_id !== quotationToDelete.bill_id)
        );
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message || "Delete failed",
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error deleting quotation",
      });
    } finally {
      setDeleteConfirmVisible(false);
      setQuotationToDelete(null);
    }
  };

  const DeleteConfirmModal = () => (
    <Modal
      visible={deleteConfirmVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setDeleteConfirmVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <Text style={styles.alertTitle}>Confirm Delete</Text>
          <Text style={styles.alertMessage}>
            Are you sure you want to delete this quotation?
          </Text>
          <View style={styles.alertButtons}>
            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: "#e74c3c" }]}
              onPress={handleDeleteQuotation}
            >
              <Text style={styles.alertButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: "#4b3ba9" }]}
              onPress={() => setDeleteConfirmVisible(false)}
            >
              <Text style={styles.alertButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
                // Action logic here...
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

  const fetchQuotations = async () => {
    if (!user?.userid) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php",
        {
          params: {
            type: "getAllQuotationDetails",
            loginid: user.userid,
          },
        }
      );

      if (response.data.status === "success") {
        setNetAmount(response.data.total_net_amt);
        setQuotations(response.data.quotations);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to load quotations",
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error fetching data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserIdAndDetails = async () => {
      setLoading(true);
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
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserIdAndDetails();
  }, []);

  useEffect(() => {
    if (user?.userid) {
      fetchQuotations();
    }
  }, [user]);

  const downloadPDF = async (billId: string) => {
    try {
      const downloadUrl = `http://crmclient.trinitysoftwares.in/admin/pdf_quotation.php?bill_id=${billId}`;
      const fileUri = FileSystem.documentDirectory + `quotation_${billId}.pdf`;

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri
      );

      const result = await downloadResumable.downloadAsync();

      if (result && result.uri) {
        const cUri = await FileSystem.getContentUriAsync(result.uri);
        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: cUri,
          flags: 1,
          type: "application/pdf",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to download PDF.",
        });
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Toast.show({
        type: "error",
        text1: "Failed to download PDF.",
      });
    }
  };

  useEffect(() => {
    if (user?.userid) {
      fetchCustomer();
    }
  }, [user]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=getAllCustomers&loginid=${user.userid}`
      );

      if (response.data.status === "success") {
        const leads = response.data.customers;
        setCustomer(leads);
      } else {
        setError("Failed to load leads");
      }
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      setError("Error fetching leads");
    }
  };

  if (userLoading || loading) {
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

          <Text style={styles.headerTitle}>Quatation Sent</Text>

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

            {/* User Picker */}
            <Text style={styles.dateLabel}>Customer</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={filterData.user}
                onValueChange={(itemValue) =>
                  setFilterData({ ...filterData, user: itemValue })
                }
                style={{ padding: 0, margin: -5 }}
              >
                <Picker.Item label="--- Select Customer ---" value="" />
                {customer.map((cust) => (
                  <Picker.Item
                    key={cust.lead_id}
                    label={cust.name}
                    value={cust.lead_id}
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
                onPress={async () => {
                  try {
                    const payload = {
                      lead_id: filterData.user,
                      from_date: fromDate.toISOString().split("T")[0],
                      to_date: toDate.toISOString().split("T")[0],
                      type: "quotation",
                    };

                    const response = await axios.post(
                      "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=getFilteredQuotation",
                      payload,
                      { headers: { "Content-Type": "application/json" } }
                    );

                    if (response.data.status === "success") {
                      setNetAmount(response.data.total_net_amt);

                      setQuotations(response.data.quotations);
                      setFilterModalVisible(false);
                    } else {
                      Toast.show({
                        type: "error",
                        text1: "Failed to fetch filtered data",
                      });
                    }
                  } catch (error) {
                    console.error(error);
                    Toast.show({
                      type: "error",
                      text1: "API Error",
                    });
                  }
                }}
              >
                Search
              </Button>
              <Button
                mode="outlined"
                style={styles.resetBtn}
                onPress={() => {
                  setFilterData({ user: "" });
                }}
              >
                Reset
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "#000", fontSize: 18 }}>Quatation Sent</Text>
        <Text style={{ color: "#000", fontSize: 18 }}>
          ₹ {netAmount?.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={filteredQuotations}
        keyExtractor={(item) => item.bill_id}
        renderItem={({ item, index }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Title
              title={`${index + 1}. 000${item.bill_id}  ${item.lead_id} ${item.customer_name}`}
              right={() => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item.bill_id);
                    setMenuVisible(true);
                  }}
                >
                  <IconButton icon="dots-vertical" />
                </TouchableOpacity>
              )}
              titleStyle={{ color: "#4b3ba9" }}
              left={() => <IconButton icon="school" iconColor={"#4b3ba9"} />}
            />
            <View style={styles.horizontalLine} />
            <Card.Content>
              <View style={styles.row}>
                <IconButton
                  icon="bookmark-outline"
                  size={18}
                  iconColor="#4b3ba9"
                />
                <Text>{item.billno}</Text>
              </View>
              {item.email ? (
                <View style={styles.row}>
                  <IconButton icon="mail" size={18} iconColor="#4b3ba9" />
                  <Text>{item.email}</Text>
                </View>
              ) : null}
              {item.mobile_no ? (
                <View style={styles.row}>
                  <IconButton
                    icon="phone-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>{item.mobile_no}</Text>
                </View>
              ) : null}

              {item.net_amt ? (
                <View style={styles.row}>
                  <IconButton
                    icon="wallet-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>₹ {parseFloat(item.net_amt || "0").toFixed(2)}</Text>
                </View>
              ) : null}
              {item.billdate ? (
                <View style={styles.row}>
                  <IconButton icon="calendar" size={18} iconColor="#4b3ba9" />
                  <Text>{item.billdate}</Text>
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
      <DeleteConfirmModal />
      <Button
        icon="plus"
        mode="contained"
        style={styles.createButton}
        labelStyle={{ fontSize: 16 }}
        onPress={() => router.push("/(components)/quatationForm")}
      >
        Create New Quatation
      </Button>
    </View>
  );
}

export default withDrawer(Quatation, "Quatation");

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    width: 160,
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
});
