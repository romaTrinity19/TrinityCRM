import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { withDrawer } from '../(components)/drawer';
type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  MessageSetting: undefined;
};
const MessageSetting = () => {
  const [email, setEmail] = useState('abc@gmail.com');
  const [secretKey, setSecretKey] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const handleReset = () => {
    setEmail('abc@gmail.com');
    setSecretKey('');
    setApiKey('');
    setLeadMessage('');
  };

  const handleSave = () => {
    // Add your save logic here
    alert('Settings saved!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
         <LinearGradient colors={["#5975D9", "#070557"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Message Setting</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Email & WhatsApp Message Setting</Text>
<View style={{padding:15}}> 
        <Text style={styles.label}>Gmail Email (Sender)</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="abc@gmail.com"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mail Secret Key</Text>
        <TextInput
          style={styles.input}
          value={secretKey}
          onChangeText={setSecretKey}
          placeholder="Secret Key"
          secureTextEntry
        />

        <Text style={styles.label}>WhatsApp's API Key</Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="API Key"
        />

        <Text style={styles.label}>Lead Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={leadMessage}
          onChangeText={setLeadMessage}
          placeholder="Message...."
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </ScrollView>
  );
};
export default withDrawer(MessageSetting, "MessageSetting");

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: '#f0f4ff',
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
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
   
    elevation: 4,
    marginHorizontal:15,
    marginTop:20
  },
  cardHeader: {
    backgroundColor: '#1a237e',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#0b1957',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  resetButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
 