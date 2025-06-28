import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { withDrawer } from "../drawer";

type RootDrawerParamList = {
  Dashboard: undefined;
  CreateReminderScreen: undefined;
  Reminder: undefined;
};
const CreateReminderScreen = () => {
  const [lead, setLead] = useState("");
   const [Category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const handleSave = () => {
    alert("Reminder Saved!");
  };
  const handleReset = () => {
  setLead("");
  setPriority("");
  setDescription("");
  setCategory('');
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WhatsApp Template Master</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.label}>
          Template Name{" "}
          <Text style={{ color: "red" }}>
            * (Use only lowercase letters and underscores)
          </Text>
        </Text>
        <TextInput
          style={styles.input}
          // value={templateName}
          // onChangeText={(text) => setTemplateName(text)}
          placeholder="Enter Template Name"
        />

        <Text style={styles.label}>
          Language <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={lead}
            onValueChange={(itemValue) => setLead(itemValue)}
          >
            <Picker.Item label="---Select Language---" value="" />
            <Picker.Item label="Language A" value="LanguageA" />
            <Picker.Item label="Language B" value="LanguageB" />
          </Picker>
        </View>

        <Text style={styles.label}>
          Category <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={Category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="---Select Category---" value="" />
            <Picker.Item label="Category A" value="CategoryA" />
            <Picker.Item label="Category B" value="CategoryB" />
          </Picker>
        </View>

        <Text style={styles.label}>
          Template Type <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
          >
            <Picker.Item label="--Select---" value="" />
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="C" value="C" />
          </Picker>
        </View>

        <Text style={styles.label}>
          Template Message<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Template Message..."
          multiline
          numberOfLines={4}
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
        />

         <TouchableOpacity style={styles.button} onPress={handleSave}>
      <Text style={styles.buttonText}>
        Save
      </Text>
    </TouchableOpacity>

    {/*Reset button*/}
    <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
      <Text style={styles.buttonText}>
        Reset
      </Text>
    </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default withDrawer(CreateReminderScreen, "CreateReminderScreen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f6ff",
    flexGrow: 1,
    paddingVertical: 30,
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
  card: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    color: "#333",
  },
  required: {
    color: "red",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    minHeight: 80,
    marginTop: 5,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1F40B5",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  resetBtn: {
  backgroundColor: "#ff4d4d",
  paddingVertical: 14,
  borderRadius: 8,
  marginTop: 10,
},

});
