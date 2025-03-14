import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles/ClientDashboard.styles";


const apiKey = "AIzaSyAs82I6c5XpsTyfuEsx6s7NWxGWFfLY8VA";//process.env.GEMINI_API_KEY; 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export default function ClientDashboard() {
  const navigation = useNavigation();

  const [projectDetails, setProjectDetails] = useState({
    name: "",
    budget: "",
    deadline: "",
    requirements: "",
  });


  const [projectPlan, setProjectPlan] = useState("");
  const [loading, setLoading] = useState(false);


  const generateProjectPlan = async () => {
    if (!projectDetails.name || !projectDetails.budget || !projectDetails.deadline || !projectDetails.requirements) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    setProjectPlan(""); 

    try {
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
        history: [],
      });

      const prompt = `Generate a detailed construction project plan with the following details:
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
      - Risk factors and mitigation strategies`;

      const result = await chatSession.sendMessage(prompt);
      setProjectPlan(result.response.text());
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

      {/* Project Details Form */}
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

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {/* Display Generated Project Plan */}
      {projectPlan !== "" && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Generated Project Plan</Text>
          <Text style={styles.text}>{projectPlan}</Text>
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Welcome")}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
