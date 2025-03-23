import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import styles from "../styles/ClientDashboard.styles";

const apiKey = "AIzaSyAs82I6c5XpsTyfuEsx6s7NWxGWFfLY8VA"; // Replace with your actual API Key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export default function ClientDashboard() {
  const navigation = useNavigation();
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    id: "",
    budget: "",
    deadline: "",
    requirements: "",
  });

  const [projectPlan, setProjectPlan] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const generateProjectPlan = async () => {
    if (!projectDetails.name || !projectDetails.budget || !projectDetails.deadline || !projectDetails.requirements) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    setProjectPlan("");
    setTasks([]);
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

  const handleRejectPlan = () => {
    setProjectPlan("");
    setTasks([]);
    setPlanGenerated(false);
    Alert.alert("Plan Rejected", "Please resubmit your project details.");
  };

  const handleAcceptPlan = async () => {
    if (!projectPlan) {
      Alert.alert("Error", "No plan to accept.");
      return;
    }

    setLoading(true);

    try {
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          responseMimeType: "text/plain",
        },
        history: [],
      });

      const prompt = `From the given construction project plan, extract the key tasks and assign milestone deadlines as JSON.`;

      const result = await chatSession.sendMessage(prompt);
      const responseText = await result.response.text();
      console.log("Task Extraction Response:", responseText);

      let extractedTasks = [];
      try {
        extractedTasks = JSON.parse(responseText);
        setTasks(extractedTasks);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        Alert.alert("Error", "Failed to parse tasks from response.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectDetails,
          plan: projectPlan,
          tasks: extractedTasks,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Project plan accepted and tasks set.");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to save project.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to process tasks.");
    } finally {
      setLoading(false);
    }
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

      {projectPlan !== "" && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Generated Project Plan</Text>
          <Text style={styles.text}>{projectPlan}</Text>

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