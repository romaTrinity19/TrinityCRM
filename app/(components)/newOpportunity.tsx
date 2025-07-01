import {
  createOpportunity,
  getAllEmployeeDetails,
  getProdServiceDetails,
  getUserDetails,
} from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withDrawer } from "../(components)/drawer";
import Toast from "react-native-toast-message";

type RootDrawerParamList = {
  Dashboard: undefined;
  CreateNewLeadForm: undefined;
  NewLeads: undefined;
};

type Lead = {
  cust_no: string;
  name: string;
  email_id: string;
  contact_no: string;
  whatsapp_no: string;
  walkin_date: string;
  state_id: string;
  estimate_amt: string;
  address: string;
  type: string;
};
const CreateNewLeadForm = () => {
  const [formData, setFormData] = useState({
    opportunity: "",
    email: " ",
    contact: "",
    walkinDate: " ",
    product: "",
    status: "",
    employee: "",
    amount: "",
    sendWhatsApp: false,
    sendMail: false,
    notes: "",
    lead: "",
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const { type, id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState([]);
  const [emp, setEmp] = useState([]);
  const [options, setOptions] = useState([]);

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedItems, setSelectedItems] = useState<string[]>(
    Array.isArray(formData.product) ? formData.product : []
  );

  const [modalVisible, setModalVisible] = useState(false);

  const toggleSelect = (itemValue: string) => {
    const updated = selectedItems.includes(itemValue)
      ? selectedItems.filter((id) => id !== itemValue)
      : [...selectedItems, itemValue];

    setSelectedItems(updated);
    handleChange("product", updated);

    // Auto-calculate rate
    const selectedRates = services
      .filter((service: any) => updated.includes(service.prod_service_id))
      .map((service: any) => Number(service.rate) || 0);

    const totalRate = selectedRates.reduce((sum, rate) => sum + rate, 0);
    handleChange("amount", totalRate.toString());
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

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getProdServiceDetails();
      if (result.status === "success") {
        setServices(result.data);
        const mapped = result.data.map((item: any) => ({
          label: item.prod_service_name,
          value: item.prod_service_id,
        }));
        setOptions(mapped);
      } else {
        console.error("Error:", result.message);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getAllEmployeeDetails();
      if (result.status === "success") {
        setEmp(result.data);
      } else {
        console.error("Error:", result.message);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);
  const formatDate = (input: string) => {
    const parts = input.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return input;
  };
  const formatDateReverse = (input: string): string => {
    if (!input) return "";
    const parts = input.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return input;
  };

  const handleSubmit = async () => {
    if (!formData.lead || !formData.opportunity || selectedItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields",
      });
      return;
    }

    const payload = {
      lead_id: formData.lead,
      expected_date: formatDate(formData.walkinDate),
      opportunity_name: formData.opportunity,
      estimated_amount: formData.amount || "0",
      notes: formData.notes || "",
      opp_status: formData.status || "",
      emp_id: formData.employee || "0",
      prod_service_id: selectedItems,
    };

    try {
      setLoading(true);

      let result;
      if (type === "update") {
        result = await axios.put(
          `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=updateOpportunity&opp_create_id=${id}&loginid=${user.userid}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        result = await createOpportunity(payload, user.userid);
      }

 

      const status = type === "update" ? result.data?.status : result?.status;

      if (status === "success") {
        Toast.show({
          type: "success",
          text1: `Opportunity ${type === "update" ? "updated" : "created"} successfully`,
        });
        router.push("/(components)/opportunity");
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: result?.data?.message || result?.message || "Try again later",
        });
      }
    } catch (err) {
      console.error("Submit error:", err);
      Toast.show({
        type: "error",
        text1: "Error submitting opportunity",
        text2: "Check your network or try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOpportunityById = async () => {
      if (type === "update" && id && user?.userid) {
        try {
          const res = await axios.get(
            `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=getOpportunityById&opp_create_id=${id}`
          );
          if (res.data.status === "success") {
            const opp = res.data.opportunity;

            setFormData({
              opportunity: opp.opportunity_name,
              email: opp.lead_details?.email_id || "",
              contact: opp.contact || "",
              walkinDate: formatDateReverse(opp.expected_date),
              product: opp.prod_service_id || [],
              status: opp.opp_status || "",
              employee: opp.emp_id || "",
              amount: opp.estimated_amount || "",
              sendWhatsApp: false,
              sendMail: false,
              notes: opp.notes || "",
              lead: opp.lead_id || "",
            });

            setSelectedItems(opp.prod_service_id || []);
          } else {
            setError("Failed to fetch opportunity");
          }
        } catch (err) {
          console.error("Error loading opportunity", err);
          setError("Error loading opportunity");
        }
      }
    };

    fetchOpportunityById();
  }, [type, id, user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" color="#fff" size={24} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Create New Opportunity</Text>

            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={{ paddingHorizontal: 18, paddingTop: 15 }}>
            <Text style={styles.label}>Select Lead *</Text>
            <View style={styles.input2}>
              <Picker
                selectedValue={formData.lead}
                onValueChange={(itemValue) => {
                  handleChange("lead", itemValue);

                  const selectedLead = leads.find(
                    (lead: any) => lead?.lead_id === itemValue
                  );
                  if (selectedLead) {
                    handleChange("email", selectedLead.email_id);
                    handleChange("contact", selectedLead.contact_no);
                  } else {
                    handleChange("email", "");
                    handleChange("contact", "");
                  }
                }}
              >
                <Picker.Item label="--Select--" value="" />
                {leads?.map((lead: any) => (
                  <Picker.Item
                    key={lead.lead_id}
                    label={`${lead.name} / ${lead.contact_no}`}
                    value={lead.lead_id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Email ID</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
            />

            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.contact}
              onChangeText={(text) => handleChange("contact", text)}
            />

            <Text style={styles.label}>Opportunity *</Text>
            <TextInput
              style={styles.inputMultiline}
              multiline
              placeholder="Enter Opportunity"
              numberOfLines={3}
              value={formData.opportunity}
              onChangeText={(text) => handleChange("opportunity", text)}
            />

            <Text style={styles.label}>Product/Service *</Text>
            <View style={styles.input}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text>
                  {selectedItems.length > 0
                    ? options
                        .filter((opt: any) =>
                          selectedItems.includes(opt?.value)
                        )
                        .map((opt: any) => opt?.label)
                        .join(", ")
                    : "--Select--"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Assigned To *</Text>
            <View style={styles.input2}>
              <Picker
                selectedValue={formData.employee}
                onValueChange={(itemValue) =>
                  handleChange("employee", itemValue)
                }
              >
                <Picker.Item label="--Select--" value="" />
                <Picker.Item label="Self" value="0" />
                {emp?.map((item: any) => (
                  <Picker.Item
                    key={item?.emp_id}
                    label={item?.emp_name}
                    value={item?.emp_id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Expected Date *</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text>
                {formData.walkinDate ? formData.walkinDate : "Select Date"}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "#000000aa",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    margin: 20,
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 15,
                    }}
                  >
                    Select Product/Service
                  </Text>

                  <FlatList
                    data={options}
                    keyExtractor={(item: any) => item.value.toString()}
                    renderItem={({ item }) => {
                      const isSelected = selectedItems.includes(item.value);
                      return (
                        <TouchableOpacity
                          onPress={() => toggleSelect(item.value)}
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            backgroundColor: isSelected ? "#e0f7fa" : "#fff",
                            borderBottomWidth: 1,
                            borderBottomColor: "#ddd",
                            borderRadius: 5,
                          }}
                        >
                          <Text style={{ fontSize: 15 }}>{item.label}</Text>
                        </TouchableOpacity>
                      );
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      marginTop: 20,
                      backgroundColor: "#5975D9",
                      padding: 12,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {showDatePicker && (
              <DateTimePicker
                value={formData.walkinDate ? new Date() : new Date()} // fallback for safety
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    const day = selectedDate
                      .getDate()
                      .toString()
                      .padStart(2, "0");
                    const month = (selectedDate.getMonth() + 1)
                      .toString()
                      .padStart(2, "0");
                    const year = selectedDate.getFullYear();
                    const formattedDate = `${day}/${month}/${year}`;
                    handleChange("walkinDate", formattedDate);
                  }
                }}
              />
            )}

            <Text style={styles.label}>Estimate Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => handleChange("amount", text)}
            />

            <Text style={styles.label}>Status</Text>
            <View style={styles.input2}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(itemValue) => handleChange("status", itemValue)}
              >
                <Picker.Item label="--Select--" value="" />
                <Picker.Item label="Open" value="Open" />
                <Picker.Item label="Won" value="Won" />
                <Picker.Item label="Lost" value="Lost" />
              </Picker>
            </View>

            <Text style={styles.label}>Internal Notes</Text>
            <TextInput
              style={styles.inputMultiline}
              placeholder="Notes...."
              multiline
              numberOfLines={3}
              value={formData.notes}
              onChangeText={(text) => handleChange("notes", text)}
            />

            <View style={styles.checkboxContainer}>
              <Switch
                value={formData.sendWhatsApp}
                onValueChange={(value: any) =>
                  handleChange("sendWhatsApp", value)
                }
              />
              <Text style={styles.checkboxLabel}>Send WhatsApp Message</Text>

              <Switch
                value={formData.sendMail}
                onValueChange={(value: any) => handleChange("sendMail", value)}
              />
              <Text style={styles.checkboxLabel}>Send Mail</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.headerTitle}>
                  {type === "update"
                    ? "Update Opportunity"
                    : "Create New Opportunity"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default withDrawer(CreateNewLeadForm, "CreateNewLeadForm");

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input2: {
    backgroundColor: "#fff",
    // padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputMultiline: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
    height: 100,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  checkboxLabel: {
    marginRight: 16,
  },
  button: {
    backgroundColor: "#001b5e",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
