// same imports as before
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Modal,
  Animated,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Linking from "expo-linking";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { withDrawer } from "./drawer";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";

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
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const openFileExternally = async (uri: string, mimeType: string) => {
    if (Platform.OS === "android") {
      const cUri = await FileSystem.getContentUriAsync(uri);

      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        type: mimeType, // e.g., application/pdf, image/jpeg
        flags: 1,
        // You could try adding categories to refine intent
        // categories: ["android.intent.category.DEFAULT"],
      }).catch(() => {
        Alert.alert("Error", "No document viewer found to open this file.");
      });
    } else {
      Linking.openURL(uri).catch(() =>
        Alert.alert("Error", "Unable to open document.")
      );
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

  const handleSave = () => {
    if (customer === "Select Customer" || !heading || !file) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    setDocuments((prev) => [...prev, { ...file, heading, customer }]);
    setCustomer(dummyCustomers[0]);
    setHeading("");
    setFile(null);
  };

  const handleDelete = (id: number) => {
    setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  };

  const isImage = (type: string) => type.startsWith("image/");

  return (
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
                {dummyCustomers.map((cust) => (
                  <Picker.Item key={cust} label={cust} value={cust} />
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
            {file && <Text style={styles.previewText}>📄 {file.fileName}</Text>}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
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

        {documents.length === 0 ? (
          <Text style={styles.noData}>No documents uploaded yet.</Text>
        ) : (
          <FlatList
            style={{ marginTop: 10 }}
            data={documents}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.documentCard}>
                <View style={styles.docLeft}>
                  {isImage(item.mimeType) ? (
                    <TouchableOpacity
                      onPress={() => setPreviewUri(item.fileUri)}
                    >
                      <Image
                        source={{ uri: item.fileUri }}
                        style={styles.docThumb}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.docIconBox}
                      onPress={() =>
                        openFileExternally(item.fileUri, item.mimeType)
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
                  <Text style={styles.docHeading}>{item.heading}</Text>
                  <Text style={styles.docSub}>{item.customer}</Text>
                  <Text style={styles.docFileName}>{item.fileName}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Icon name="trash-can-outline" size={26} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

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
    </View>
  );
};

export default withDrawer(ClientDocumentScreen, "ClientDocumentScreen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6ff",
    paddingTop: 30,
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
