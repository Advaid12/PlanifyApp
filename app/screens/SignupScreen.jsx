import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import styles from "../styles/SignUpScreen.styles";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/register", { name, email, password, role });
      Alert.alert("Registration Successful!", "You can now log in.");
      navigation.replace("Login");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={styles.input}>
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Client" value="Client" />
        <Picker.Item label="Site Engineer" value="Site Engineer" />
        <Picker.Item label="Worker" value="Worker" />
      </Picker>

      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
