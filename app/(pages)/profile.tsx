import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [name, setName] = useState("Admin");
  const [username, setUsername] = useState("adminuser");
  const [password, setPassword] = useState("password123");
  const [contact, setContact] = useState("9770131555");
  const [email, setEmail] = useState("nipeshp@gmail.com");
  const [address, setAddress] = useState("Earth");
  const [imageUri, setImageUri] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );
  const [logoUri, setLogoUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Camera roll permissions are required."
        );
      }
    })();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleLogoPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 2],
      quality: 0.7,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f2f6ff", paddingBottom: 60 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" color="#fff" size={24} />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Trinity CRM</Text>

              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <MaterialIcons name="logout" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.avatarContainer}
          >
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          </TouchableOpacity>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Contact No.</Text>
            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Logo</Text>
            <TouchableOpacity onPress={handleLogoPick}>
              <View pointerEvents="none">
                <TextInput
                  style={styles.input}
                  placeholder="Select Logo"
                  value={logoUri ? "Logo Selected" : ""}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            {logoUri && (
              <Image
                source={{ uri: logoUri }}
                style={{
                  width: 200,
                  height: 100,
                  resizeMode: "contain",
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
            )}

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f6ff",
    flexGrow: 1,
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
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  updateButton: {
    marginTop: 20,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#1a237e",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  updateText: {
    color: "#1a237e",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
