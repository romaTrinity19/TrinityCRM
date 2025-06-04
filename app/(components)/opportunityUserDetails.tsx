import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const menuItems = ["Edit", "Delete", "Whatsapp", "Transfer"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Information");
  const [menuVisible, setMenuVisible] = useState(false);
  const [images, setImages] = useState<ImagePickerAsset[]>([]); // Typed here
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null
  );
  const [galleryVisible, setGalleryVisible] = useState(false); // For showing all images gallery

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
          <Text style={styles.name}>Roma Chakradhari</Text>
          <Text style={styles.amount}>₹ 1000.00</Text>
        </View>

        <View style={styles.detailsBox}>
          <Text style={styles.label}>
            Opportunity No: <Text style={styles.value}>008</Text>
          </Text>
          <Text style={styles.label}>
            Opportunity Date: <Text style={styles.value}>23-05-2025</Text>
          </Text>
          <Text style={styles.label}>
            Name: <Text style={styles.value}>Trinity Solutions</Text>
          </Text>
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
            <View style={styles.infoGrid}>
              {/* Left Column */}
              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Contact Info:</Text>
                  <Text style={styles.infoLabel}>Product / Service:</Text>

                  <Text style={styles.infoLabel}>Opportunity Service:</Text>
                  <Text style={styles.infoLabel}>Opportunity Agent:</Text>
                  <Text style={styles.infoLabel}>Opportunity Owner:</Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoValue}>1234567890</Text>
                  <Text style={styles.infoValue}>Software Development</Text>
                  <Text style={styles.infoValue}>Trinity Solutions</Text>

                  <Text style={styles.infoValue}>Trinity Solutions</Text>

                  <Text style={styles.infoValue}>Trinity Solutions</Text>
                </View>
              </View>
            </View>
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
        >
          <View style={styles.menuModal}>
            {menuItems.map((item) => (
              <Text key={item} style={styles.menuItem}>
                {item}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
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
  label: { fontSize: 14, marginVertical: 4, color: "#001b5e" },
  value: { fontWeight: "bold", color: "#5975D9" },

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

  infoSection: {
    padding: 15,
    backgroundColor: "#eef2ff",
    borderRadius: 8,
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

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoColumn: {
    flex: 1,
    paddingRight: 10,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: "600",
    color: "#001b5e",
    marginTop: 8,
  },
  infoValue: {
    color: "#5975D9",
    fontWeight: "600",
    marginTop: 8,
  },
});
