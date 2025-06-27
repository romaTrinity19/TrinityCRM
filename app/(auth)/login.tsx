import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

// 🔹 Register Form Component
const RegisterForm = ({ switchToLogin }: { switchToLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost/CRM/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "register",
          email,
          username,
          password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Registered successfully!");
        router.push("/(pages)/home");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      alert("Error connecting to server");
      console.error("Register error:", error);
    }
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={switchToLogin}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>

       
    </>
  );
};

// 🔹 Forgot Password Component
const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const [username, setUsername] = useState("");
  

  const handleReset = () => {
    if (!username) {
      Alert.alert("Error", "Please enter your registered username");
      return;
    }

    Alert.alert("Success", "Password reset link sent to your email");
    onBack(); // go back to login/register
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack}>
        <Text style={[styles.linkText, { color: "gray" }]}>Back</Text>
      </TouchableOpacity>
    </>
  );
};

type LoginFormProps = {
  switchToRegister: () => void;
  switchToForgot: () => void;
};


// 🔹 Login Component
const LoginForm = ({ switchToRegister, switchToForgot }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Required",
        text2: "Please enter both username and password",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://crmclient.trinitysoftwares.in/crmAppApi/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "login",
          username,
          password,
        }),
      });

      const result = await response.json();

      

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
        });

        setTimeout(() => {
          router.push("/(pages)/home");
        }, 500);
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: result.message || "Invalid credentials",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Cannot connect to API",
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
       value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={switchToRegister}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={switchToForgot}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </>
  );
};

// 🔹 Main Component
export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // login | register | forgot

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.innerContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("@/assets/images/log.jpeg")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            {mode === "login"
              ? "Login"
              : mode === "register"
              ? "Register"
              : "Forgot Password"}
          </Text>

          {mode === "login" && (
            <LoginForm
              switchToRegister={() => setMode("register")}
              switchToForgot={() => setMode("forgot")}
            />
          )}
          {mode === "register" && (
            <RegisterForm
              switchToLogin={() => setMode("login")}
            />
          )}
          {mode === "forgot" && <ForgotPasswordForm onBack={() => setMode("login")} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  linkText: {
  color: "#0c1142",
  fontSize: 14,
  marginTop: 8,
  textDecorationLine: "underline",
  fontWeight: "500",
  alignSelf: "center",
},

  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
  },
  forgotText: {
    color: "#0c1142",
    marginBottom: 12,
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: "500",
    alignSelf: "flex-end",
  },

  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    flexGrow: 1,
  },
  image: {
    height: 150,
    width: 150,
    marginBottom: 24,
    borderRadius: 75,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0c1142",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0c1142",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
