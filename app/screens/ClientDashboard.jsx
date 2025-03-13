import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/ClientDashboard.styles";

export default function ClientDashboard() {
  const navigation = useNavigation();

  // 🔹 State for project details
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    budget: "",
    deadline: "",
    requirements: "",
  });

  // 🔹 State for AI-generated project plan
  const [projectPlan, setProjectPlan] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Gemini API Key (Replace with your key)
  const API_KEY = "AIzaSyCRa8_-k483JqStvyI-bHCXNC3xWjOBTEo";
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateText?key=${API_KEY}`;

  // 🔹 Function to Call Gemini API
  const generateProjectPlan = async () => {
    if (!projectDetails.name || !projectDetails.budget || !projectDetails.deadline || !projectDetails.requirements) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true); // Show loader while fetching
    setProjectPlan(""); // Clear old plan

    const requestBody = {
      prompt: {
        text: `Generate a detailed construction project plan with the following details:
        - Project Name: ${projectDetails.name}
        - Budget: ${projectDetails.budget} USD
        - Deadline: ${projectDetails.deadline}
        - Requirements: ${projectDetails.requirements}
        
        The project plan should include:
        - Phase-wise breakdown (Planning, Foundation, Framing, Roofing, Interiors)
        - Estimated time for each phase
        - Cost distribution per phase
        - Materials required
        - Workforce allocation
        - Risk factors and mitigation strategies`,
      },
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        setProjectPlan(data.candidates[0].output);
      } else {
        Alert.alert("Error", "Failed to generate project plan.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to connect to Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Client Dashboard</Text>

      {/* 🔹 Project Details Form */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Enter Project Details</Text>

        <TextInput
          placeholder="Project Name"
          style={styles.input}
          value={projectDetails.name}
          onChangeText={(text) => setProjectDetails({ ...projectDetails, name: text })}
        />

        <TextInput
          placeholder="Budget (in USD)"
          style={styles.input}
          keyboardType="numeric"
          value={projectDetails.budget}
          onChangeText={(text) => setProjectDetails({ ...projectDetails, budget: text })}
        />

        <TextInput
          placeholder="Deadline (YYYY-MM-DD)"
          style={styles.input}
          value={projectDetails.deadline}
          onChangeText={(text) => setProjectDetails({ ...projectDetails, deadline: text })}
        />

        <TextInput
          placeholder="Project Requirements"
          style={[styles.input, { height: 80 }]}
          multiline
          value={projectDetails.requirements}
          onChangeText={(text) => setProjectDetails({ ...projectDetails, requirements: text })}
        />

        <TouchableOpacity style={styles.button} onPress={generateProjectPlan}>
          <Text style={styles.buttonText}>Generate Project Plan</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {/* 🔹 Display Generated Project Plan */}
      {projectPlan !== "" && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Generated Project Plan</Text>
          <Text style={styles.text}>{projectPlan}</Text>
        </View>
      )}

      {/* 🔹 Logout Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Welcome")}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
