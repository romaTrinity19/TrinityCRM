import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { withDrawer } from "./drawer";

type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  AddAttachment: undefined;
};

const AddAttachment = () => {
  const [selectedLead, setSelectedLead] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [fileName, setFileName] = useState("No file chosen");
  const [remarks, setRemarks] = useState("");
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const fileAsset = res.assets[0];
        setFile(fileAsset);
        setFileName(fileAsset.name);
      }
    } catch (err) {
      Alert.alert("Error", "File selection failed.");
    }
  };

  const handleReset = () => {
    setSelectedLead("");
    setFile(null);
    setFileName("No file chosen");
    setRemarks("");
  };

  const handleSave = () => {
    if (!selectedLead || !file) {
      Alert.alert("Error", "Please select a lead and upload a file.");
      return;
    }
    Alert.alert("Success", "Attachment saved successfully!");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#070557"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Attachment</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={{ paddingHorizontal:20 , marginTop:25 }}>
        <Text style={styles.label}>Select Lead*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLead}
            onValueChange={(itemValue) => setSelectedLead(itemValue)}
          >
            <Picker.Item label="---Select Lead---" value="" />
            <Picker.Item label="Lead 1" value="lead1" />
            <Picker.Item label="Lead 2" value="lead2" />
          </Picker>
        </View>

        <Text style={styles.label}>Uploads Attachment*</Text>
        <TouchableOpacity style={styles.fileInput} onPress={handleFilePick}>
          <Text style={{ color: "#000" }}>Choose Files</Text>
          <Text style={styles.fileName}>{fileName}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Remarks</Text>
        <TextInput
          placeholder="Remark..."
          style={styles.textarea}
          multiline
          numberOfLines={3}
          value={remarks}
          onChangeText={setRemarks}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default withDrawer(AddAttachment, "AddAttachment");

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    backgroundColor: "#f3f6fd",
    flex: 1,
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
  label: {
    marginBottom: 6,
    fontWeight: "600",
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
  },
  fileInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  fileName: {
    fontSize: 12,
    color: "#666",
  },
  textarea: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#001b5e",
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#cc0000",
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
