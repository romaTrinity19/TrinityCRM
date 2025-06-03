import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
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
  AddBillScreen: undefined;
};
const AddBillScreen = () => {
  const [customer, setCustomer] = useState("");
  const [billNo, setBillNo] = useState("#0001");
  const [billAmount, setBillAmount] = useState("");
  const [billDate, setBillDate] = useState("05/20/2025");
  const [billDueDate, setBillDueDate] = useState("");
  const [remark, setRemark] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
 const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const fileAsset = res.assets[0];

        setFileName(fileAsset.name);
      }
    } catch (err) {
      Alert.alert("Error", "File selection failed.");
    }
  };

  const resetForm = () => {
    setCustomer("");
    setBillAmount("");
    setBillDueDate("");
    setRemark("");
    setFileName("No file chosen");
  };

  return (
    <ScrollView style={styles.container}>
          <LinearGradient colors={["#5975D9", "#070557"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Bill</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={{paddingHorizontal:15 , marginTop:20}}> 
      <Text style={styles.headerr}>Bill Details</Text>

      <Text style={styles.label}>Customer</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={customer}
          onValueChange={(itemValue) => setCustomer(itemValue)}
        >
          <Picker.Item label="--- Select Customer ---" value="" />
          <Picker.Item label="Mr. Sumeet Ahuja" value="sumeet" />
          <Picker.Item label="Nishant Sir Baloda" value="nishant" />
          <Picker.Item label="Vishal Tamrakar" value="vishal" />
        </Picker>
      </View>

      <Text style={styles.label}>Bill No</Text>
      <TextInput style={styles.input} value={billNo} editable={false} />

      <Text style={styles.label}>Bill Amount</Text>
      <TextInput
        style={styles.input}
        value={billAmount}
        onChangeText={setBillAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Bill Date</Text>
      <TextInput style={styles.input} value={billDate} editable={false} />

      <Text style={styles.label}>Bill Due Date</Text>
      <TextInput
        style={styles.input}
        value={billDueDate}
        onChangeText={setBillDueDate}
      />

      <Text style={styles.label}>Upload Bill</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
        <Text style={styles.uploadBtn}>Choose File</Text>
        <Text style={styles.fileName}>{fileName}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Remark</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={remark}
        onChangeText={setRemark}
        multiline
        placeholder="Remark"
      />

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Past Bills */}
      <View style={styles.billCard}>
        <Text style={styles.billTitle}>Mr. Sumeet Ahuja (Prem Sound)</Text>
        <Text>₹ 20,000.00</Text>
        <Text>01-01-2023</Text>
        <Text>Software done rate with 20k</Text>
      </View>

      <View style={styles.billCard}>
        <Text style={styles.billTitle}>Nishant Sir Baloda</Text>
        <Text>₹ 15,000.00</Text>
        <Text>11-04-2023</Text>
        <Text>153</Text>
      </View>

      <View style={styles.billCard}>
        <Text style={styles.billTitle}>Vishal Tamrakar</Text>
        <Text>₹ 40,000.00</Text>
        <Text>18-04-2023</Text>
        <Text>Website</Text>
      </View>

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: "#f4f7fe",
  },
  
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginTop: 5,
  },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  uploadBtn: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  fileName: {
    flexShrink: 1,
    fontStyle: "italic",
  },
  btnContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  saveBtn: {
    backgroundColor: "#0c1d66",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  resetBtn: {
    backgroundColor: "#e42222",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  billCard: {
    backgroundColor: "white",
    padding: 12,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  billTitle: {
    fontWeight: "bold",
    color: "#202a71",
    marginBottom: 5,
  },
   headerr: {
    backgroundColor: '#202a71',
    color: 'white',
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
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
});

 
export default withDrawer(AddBillScreen, "AddBillScreen");
