// same imports as before
import {
  getAllClientDocument,
  getMimeType,
  getUserDetails,
} from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { withDrawer } from "./drawer";

const dummyCustomers = ["Select Customer", "John Doe", "Jane Smith", "Michael"];
const themeColor = "#5975D9";

interface DocumentItem {
  id: number;
  customer: string;
  heading: string;
  fileUri: string;
  fileName: string;
  mimeType: string;
}
type RootDrawerParamList = {
  ClientDocumentScreen: undefined;
};
const ClientDocumentScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [customer, setCustomer] = useState(dummyCustomers[0]);
  const [heading, setHeading] = useState("");
  const [file, setFile] = useState<DocumentItem | null>(null);

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [customerr, setCustomerr] = useState<any[]>([]);

  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [clientDocument, setClientDocument] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<
    string | null
  >(null);

  const [isOpening, setIsOpening] = useState(false);

  const openFileExternally = async (url: string, mimeType: string) => {
    if (isOpening) return;

    try {
      setIsOpening(true);

      if (Platform.OS === "android") {
        const fileName = url.split("/").pop() ?? `file_${Date.now()}`;
        const fileUri = FileSystem.cacheDirectory + fileName;

        const downloadResumable = FileSystem.createDownloadResumable(
          url,
          fileUri
        );
        const downloadResult = await downloadResumable.downloadAsync();

        if (!downloadResult) throw new Error("Download failed");

        const cUri = await FileSystem.getContentUriAsync(downloadResult.uri);

        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: cUri,
          type: mimeType,
          flags: 1,
        });
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("❌ Error opening file:", error);
      Alert.alert("Error", "Unable to open the document.");
    } finally {
      setIsOpening(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.assets && result.assets.length > 0) {
      const fileAsset = result.assets[0];
      setFile({
        id: Date.now(),
        customer,
        heading,
        fileUri: fileAsset.uri,
        fileName: fileAsset.name ?? "Unnamed File",
        mimeType: fileAsset.mimeType ?? "application/octet-stream",
      });
    }
  };

  const handleSave = async () => {
    if (customer === "Select Customer" || !heading || !file) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }
    setUploading(true);
    const formData = new FormData();

    const sessionid = "SESSION123";

    formData.append("cust_id", customer.toString());
    formData.append("remark", heading);
    formData.append("loginid", user?.userid);
    formData.append("sessionid", sessionid);

    formData.append("attachment[]", {
      uri: file.fileUri,
      name: file.fileName,
      type: file.mimeType,
    } as any);

    try {
      const response = await axios.post(
        "http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=uploadClientDocument",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: "Document uploaded successfully",
        });

        setHeading("");
        setFile(null);
        fetchClientDocumentDetails();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "API Error",
        text2: "Something went wrong during upload.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDelete = async (attachmentId: string) => {
    try {
      const response = await axios.delete(
        `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=deleteClientDocument&attachment_id=${attachmentId}`
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: "Document deleted successfully",
        });
        fetchClientDocumentDetails();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message || "Delete failed",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error deleting document",
      });
    } finally {
      setDeleteModalVisible(false);
      setSelectedAttachmentId(null);
    }
  };

  const isImage = (type?: string) => {
    return typeof type === "string" && type.startsWith("image/");
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
      }
    };

    fetchUserIdAndDetails();
  }, []);

  useEffect(() => {
    if (user?.userid) {
      fetchAllCustomer();
    }
  }, [user]);
  const fetchAllCustomer = async () => {
    try {
      const response = await axios.get(
        `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=getAllCustomers&loginid=${user.userid}`
      );

      if (response.data.status === "success") {
        const leads = response.data.customers;
        setCustomerr(leads);
      } else {
        setError("Failed to load leads");
      }
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      setError("Error fetching leads");
    }
  };

  const fetchClientDocumentDetails = async () => {
    const result = await getAllClientDocument();
    if (result.status === "success") {
      setClientDocument(result.documents);
    } else {
      console.error("Error:", result.message);
    }
  };
  useEffect(() => {
    fetchClientDocumentDetails();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f2f6ff",
      }}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={["#5975D9", "#1F40B5"]}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#004c91",
            padding: 15,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            Upload Client Document
          </Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <FlatList
          data={clientDocument}
          keyExtractor={(item: any) => item.attachment_id}
          ListEmptyComponent={
            <Text style={styles.noData}>No documents uploaded yet.</Text>
          }
          ListHeaderComponent={
            <View style={{ padding: 16 }}>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 20,
                  elevation: 2,
                }}
              >
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Select Customer</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={customer}
                      onValueChange={(value) => setCustomer(value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="-- Select customer --" value="" />
                      {customerr?.map((item: any) => (
                        <Picker.Item
                          key={item?.lead_id}
                          label={item?.name}
                          value={item?.lead_id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputBox}>
                  <Text style={styles.label}>Heading</Text>
                  <TextInput
                    placeholder="Enter document heading"
                    style={styles.input}
                    value={heading}
                    onChangeText={setHeading}
                  />
                </View>

                <View style={styles.inputBox}>
                  <Text style={styles.label}>Upload Attachment</Text>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickDocument}
                  >
                    <Icon name="file-upload-outline" size={22} color="#fff" />
                    <Text style={styles.uploadText}>Upload File</Text>
                  </TouchableOpacity>
                  {file && (
                    <Text style={styles.previewText}>📄 {file.fileName}</Text>
                  )}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                  >
                    {uploading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                      setCustomer(dummyCustomers[0]);
                      setHeading("");
                      setFile(null);
                    }}
                  >
                    <Text style={styles.buttonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {clientDocument?.length > 0 && (
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginTop: 20,
                    marginBottom: 10,
                    color: "#333",
                  }}
                >
                  Uploaded Documents
                </Text>
              )}
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.documentCard}>
              <View style={styles.docLeft}>
                {item.attachment_path?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <TouchableOpacity
                    onPress={() => setPreviewUri(item.attachment_path)}
                  >
                    <Image
                      source={{ uri: item.attachment_path }}
                      style={styles.docThumb}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.docIconBox}
                    onPress={() =>
                      openFileExternally(
                        item.attachment_path,
                        getMimeType(item.attachment_path)
                      )
                    }
                  >
                    <Icon
                      name="file-document-outline"
                      size={32}
                      color={themeColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.docCenter}>
                <Text style={styles.docHeading}>{item.customer_name}</Text>
                <Text style={styles.docSub}>{item.remark}</Text>
                <Text style={styles.docFileName}>{item.customer_email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedAttachmentId(item.attachment_id);
                  setDeleteModalVisible(true);
                }}
              >
                <Icon name="trash-can-outline" size={26} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Image Preview Modal */}
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
              <Icon name="close" size={30} color="#fff" />
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
                Are you sure you want to delete this document?
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
                  <Text style={{ color: "#000", fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedAttachmentId) {
                      handleConfirmDelete(selectedAttachmentId);
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
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default withDrawer(ClientDocumentScreen, "ClientDocumentScreen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: themeColor,
    marginBottom: 20,
  },
  inputBox: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    margin: -5,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColor,
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  uploadText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  previewText: {
    marginTop: 6,
    fontStyle: "italic",
    fontSize: 12,
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: themeColor,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
  },
  resetButton: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  noData: {
    textAlign: "center",
    fontSize: 14,
    color: "#999",
    marginTop: 30,
    fontStyle: "italic",
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginHorizontal: 15,
  },
  docLeft: {
    marginRight: 12,
  },
  docThumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  docIconBox: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#eef1ff",
    justifyContent: "center",
    alignItems: "center",
  },
  docCenter: {
    flex: 1,
  },
  docHeading: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#333",
  },
  docSub: {
    fontSize: 12,
    color: "#666",
  },
  docFileName: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  modalImage: {
    width: "100%",
    height: "80%",
    borderRadius: 8,
  },
});
