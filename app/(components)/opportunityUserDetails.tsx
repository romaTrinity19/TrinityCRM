import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const menuItems = ["Edit", "Delete", "Whatsapp", "Transfer"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Information");
  const { id } = useLocalSearchParams();
  const [menuVisible, setMenuVisible] = useState(false);
  const [images, setImages] = useState<ImagePickerAsset[]>([]); // Typed here
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null
  );
  const [galleryVisible, setGalleryVisible] = useState(false); // For showing all images gallery
  const formatDateReverse = (input: string): string => {
    if (!input) return "";
    const parts = input.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return input;
  };
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImages((prev: ImagePickerAsset[]) => [...prev, ...result.assets]);
    }
  };

  const openImage = (image: ImagePickerAsset) => {
    setSelectedImage(image);
    setPreviewVisible(true);
  };

  const [data, setData] = useState<any>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteVisible, setDeleteVisible] = useState(false);

  useEffect(() => {
    const fetchOpportunityById = async () => {
      if (!id) return;

      try {
        const res = await axios.get(
          `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=getOpportunityById&opp_create_id=${id}`
        );

        if (res.data.status === "success") {
          setData(res.data.opportunity);
        } else {
          setError("Opportunity not found");
        }
      } catch (err) {
        console.error("Error fetching opportunity:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunityById();
  }, [id]);

  const handleMenuItemPress = async (action: any) => {
    setMenuVisible(false);

    switch (action) {
      case "Edit":
        router.push({
          pathname: "/(components)/newOpportunity",
          params: { type: "update", id: id },
        });
        break;

      case "Delete":
        setDeleteVisible(true);
        break;

      case "Whatsapp":
        const url = `whatsapp://send?phone=${data?.whatsapp_no}`;
        Linking.openURL(url).catch(() =>
          Alert.alert("Error", "WhatsApp is not installed on your device")
        );
        break;

      case "Transfer":
        Alert.alert("Transfer action triggered");
        break;

      default:
        break;
    }
  };
  const handleConfirmDelete = async () => {
    setDeleteVisible(false);
    try {
      const res = await axios.delete(
        `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=deleteOpportunity&id=${id}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.status === "success") {
        Toast.show({ type: "success", text1: "Deleted successfully" });
        router.push("/(components)/opportunity");
      } else {
        Toast.show({
          type: "error",
          text1: res.data.message || "Failed to delete",
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Network error" });
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
    <View style={styles.safeContainer}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Opportunity Details</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>{data?.name}</Text>
          <Text style={styles.amount}>{data?.estimated_amount}</Text>
        </View>

        <View style={styles.detailsBox}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Opportunity No</Text>
            <Text style={styles.value}>: 000{id}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Opportunity Date</Text>
            <Text style={styles.value}>
              : {formatDateReverse(data?.expected_date)}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>: {data?.name}</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Information" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Information")}
          >
            <Text style={styles.tabText}>Information</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Notes" && styles.activeTab]}
            onPress={() => setActiveTab("Notes")}
          >
            <Text style={styles.tabText}>Notes</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "Information" ? (
          <View style={styles.infoSection}>
            {[
              { label: "Contact Info", value: data?.contact || "-" },
              {
                label: "Product / Service",
                value: Array.isArray(data?.prod_service_names)
                  ? data.prod_service_names.map((item: any, i: any) => (
                      <Text key={i} style={styles.infoValueLine}>
                        • {item}
                      </Text>
                    ))
                  : "-",
              },
              {
                label: "Opportunity Source",
                value: data?.lead_details?.lead_source_name || "-",
              },
              {
                label: "Opportunity Agent",
                value: data?.lead_details?.agent_name || "-",
              },
              { label: "Opportunity Owner", value: data?.emp_name || "-" },
            ].map((item, index) => (
              <View key={index} style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <View style={styles.infoRightColumn}>
                  {typeof item.value === "string" ? (
                    <Text style={styles.infoValue}>{item.value}</Text>
                  ) : (
                    item.value
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.notesSection}>
            <TextInput placeholder="Enter title here" style={styles.input} />
            <TextInput
              placeholder="Click to expand"
              style={[styles.input, { height: 100 }]}
              multiline
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachBtn} onPress={pickImage}>
                <Text style={styles.btnText}>Attach Files</Text>
              </TouchableOpacity>
            </View>

            {/* Show uploaded image count and open gallery on click */}
            {images.length > 0 && (
              <TouchableOpacity
                onPress={() => setGalleryVisible(true)}
                style={{ marginTop: 10 }}
              >
                <Text style={styles.uploaded}>
                  📎 {images.length} file(s) uploaded
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.noteBox}>
          <Text style={styles.noteHeader}>🧑 Roma Chakradhari</Text>
          <Text style={styles.noteDate}>10-12-2025</Text>
          <Text style={styles.noteContent}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat,
            eum!
          </Text>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal visible={previewVisible} transparent animationType="slide">
        <View style={styles.previewContainer}>
          <TouchableOpacity
            style={styles.closePreview}
            onPress={() => setPreviewVisible(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Gallery Modal for all images */}
      <Modal visible={galleryVisible} transparent animationType="slide">
        <View
          style={[
            styles.previewContainer,
            { backgroundColor: "rgba(0,0,0,0.9)" },
          ]}
        >
          <TouchableOpacity
            style={styles.closePreview}
            onPress={() => setGalleryVisible(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <FlatList
            data={images}
            keyExtractor={(item, index) => item.uri + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => openImage(item)}
                style={{ margin: 5 }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            numColumns={3}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ padding: 10 }}
          />
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.menuModal}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleMenuItemPress(item)}
              >
                <Text style={styles.menuItem}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent
        visible={deleteVisible}
        animationType="fade"
        onRequestClose={() => setDeleteVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setDeleteVisible(false)}
        >
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Confirm Deletion</Text>
            <Text style={styles.confirmMsg}>
              Are you sure you want to delete this lead?
            </Text>

            <View style={styles.confirmBtnContainer}>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setDeleteVisible(false)}
              >
                <Text style={styles.confirmBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#d9534f" }]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmBtnText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    paddingTop: 30,
  },
  headerBar: {
    backgroundColor: "#5975D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: { fontSize: 20, fontWeight: "700", color: "#001b5e" },
  amount: { fontSize: 20, fontWeight: "700", color: "#070557" },

  detailsBox: {
    marginTop: 10,
    backgroundColor: "#e6e9ff",
    padding: 15,
    borderRadius: 10,
  },
  label: { fontSize: 14, marginVertical: 4, color: "#001b5e", width: "45%" },
  value: { fontWeight: "bold", color: "#5975D9", width: "55%" },

  tabRow: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#d4dbff",
    marginHorizontal: 2,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#5975D9",
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
  },

  infoText: {
    marginVertical: 5,
    fontSize: 14,
    color: "#001b5e",
    fontWeight: "bold",
  },

  notesSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c0c6ff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },
  saveBtn: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  attachBtn: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  uploaded: {
    marginTop: 10,
    color: "#555",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  noteBox: {
    backgroundColor: "#f1f3ff",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#5975D9",
  },
  noteHeader: { fontWeight: "bold", color: "#001b5e" },
  noteDate: { color: "#777", fontSize: 12, marginBottom: 6 },
  noteContent: { fontSize: 13, color: "#333" },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menuModal: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  menuItem: {
    paddingVertical: 10,
    fontSize: 16,
    color: "#001b5e",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "80%",
  },
  closePreview: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },

  infoRow: {
    marginBottom: 10,
  },

  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginVertical: 10,
  },

  infoRowBorder: {
    flexDirection: "row",

    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  infoLabel: {
    fontWeight: "bold",
    color: "#000",
    width: "44%",
    fontSize: 14,
  },

  infoRightColumn: {
    flex: 2,
  },

  infoValue: {
    color: "#000",
    fontSize: 14,
    width: "56%",
  },

  infoValueLine: {
    color: "#000",
    fontSize: 14,
    lineHeight: 20,
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
