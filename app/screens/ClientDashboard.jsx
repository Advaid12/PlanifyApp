import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles/ClientDashboard.styles";

const apiKey = "AIzaSyC8pRmxdohVeqKVX_Rqyn4I4fn9Eh3KrVA"; 
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export default function ClientDashboard() {
  const navigation = useNavigation();
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    id: "",
    budget: "",
    beginningDate: "",
    deadline: "",
    requirements: "",
  });

  const [projectPlan, setProjectPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  // Generate project plan using Gemini API
  const generateProjectPlan = async () => {
    if (!projectDetails.name || !projectDetails.budget ||!projectDetails.beginningDate || !projectDetails.deadline || !projectDetails.requirements) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    setProjectPlan("");
    setPlanGenerated(false);

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
      - Project ID: ${projectDetails.id}
      - Budget: ${projectDetails.budget} INR
      - BeginningDate: ${projectDetails.beginningDate}
      - Deadline: ${projectDetails.deadline}
      - Requirements: ${projectDetails.requirements}`;

      const result = await chatSession.sendMessage(prompt);
      setProjectPlan(result.response.text());
      setPlanGenerated(true);
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to connect to Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  // Accept plan and save project details in the database
  const handleAcceptPlan = async () => {
    if (!projectPlan) {
      Alert.alert("Error", "No plan to accept.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/save-project-details", {
        project_id: projectDetails.id,
        name: projectDetails.name,
        budget: projectDetails.budget,
        beginningDate:projectDetails.beginningDate,
        deadline: projectDetails.deadline,
      });

      Alert.alert("Success", "Project details saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      Alert.alert("Error", "Failed to save project details.");
    } finally {
      setLoading(false);
    }
  };

  // Reject plan and reset the state
  const handleRejectPlan = () => {
    setProjectPlan("");
    setPlanGenerated(false);
    Alert.alert("Plan Rejected", "Please resubmit your project details.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Client Dashboard</Text>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Enter Project Details</Text>

        {Object.keys(projectDetails).map((key) => (
          <TextInput
            key={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            style={styles.input}
            value={projectDetails[key]}
            onChangeText={(text) => setProjectDetails((prev) => ({ ...prev, [key]: text }))}
          />
        ))}

        <TouchableOpacity style={styles.button} onPress={generateProjectPlan}>
          <Text style={styles.buttonText}>Generate Project Plan</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {planGenerated && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Generated Project Plan</Text>
          <Text style={styles.text}>{projectPlan}</Text>

          {/* Show Accept and Reject buttons only after the plan is generated */}
          <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]} onPress={handleAcceptPlan}>
            <Text style={styles.buttonText}>Accept Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={handleRejectPlan}>
            <Text style={styles.buttonText}>Reject Plan</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
