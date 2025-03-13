import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/LoginScreen.styles"; // Import styles

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Use correct API URL for different platforms
  const API_URL =
    Platform.OS === "android" ? "http://10.0.2.2:5000/api/login" : "http://localhost:5000/api/login";

  // 🛠️ Handle Login Request
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      console.log("🔵 Sending login request...");
      const response = await axios.post(API_URL, { email, password }, { headers: { "Content-Type": "application/json" } });

      console.log("🟢 Response received:", response.data);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server.");
      }

      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userRole", user.role);

      console.log("✅ User authenticated, navigating to dashboard...");
      console.log("➡ User Role:", user.role);

      // 🛠️ Ensure navigation works properly
      if (!navigation) {
        console.error("❌ Navigation object is undefined!");
        return;
      }

      // 🚀 Navigate based on role
      if (user.role === "Client") {
        navigation.navigate("ClientDashboard");
      } else if (user.role === "Site Engineer") {
        navigation.navigate("EngineerDashboard");
      } else if (user.role === "Worker") {
        navigation.navigate("WorkerDashboard");  // ✅ Corrected name
      } else {
        navigation.navigate("Signup");
      }
      

    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
