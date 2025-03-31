import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/LoginScreen.styles"; // Ensure you have a styles file

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Define API URL (adjust for your backend)
  const API_URL = "http://localhost:5000/api/login"; // Change to your API URL

  // 🛠️ Handle Login Request
  const handleLogin = async () => {
    await AsyncStorage.setItem("userEmail", email);
    if (!email.trim() || !password.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    setLoading(true);
    setErrorMessage("");
  
    try {
      const response = await axios.post(API_URL, { email, password });
      const { token, user } = response.data;
  
      if (!token || !user || !user.id) {
        throw new Error("Invalid response from server.");
      }
  
      console.log("✅ Saving userId to AsyncStorage:", user.id); // ✅ Debug Log
  
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userId", user.id);  // ✅ Store user ID
      await AsyncStorage.setItem("userRole", user.role);
      await AsyncStorage.setItem("userEmail", email); 

      if (user.role === "Worker") {
        navigation.navigate("ViewMilestone");
      } else if (user.role === "Client") {
        navigation.navigate("ClientHome");
      } else if (user.role === "Site Engineer") {
        navigation.navigate("site-engineer");
      } else {
        navigation.navigate("Welcome");
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

      {/* ✅ Added Chat Button */}
      <TouchableOpacity onPress={() => navigation.navigate("JoinChat")} style={styles.chatButton}>
        <Text style={styles.chatButtonText}>Go to Chat</Text>
      </TouchableOpacity>

    </View>
  );
}
