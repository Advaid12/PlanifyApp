import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure correct import
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

export default function ClientDashboard() {
  const navigation = useNavigation();

  // 🔹 State for project details
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    budget: "",
    deadline: "",
    requirements: "",
  });

  // 🔹 State for AI-generated project plan and milestone
  const [projectPlan, setProjectPlan] = useState("");
  const [storedPlan, setStoredPlan] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [milestoneLoading, setMilestoneLoading] = useState(false);

  // 🔹 Direct API Key (Replace with your actual key)
  const apiKey = "AIzaSyAs82I6c5XpsTyfuEsx6s7NWxGWFfLY8VA";

  // Initialize genAI directly
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // 🔹 Function to Call Gemini API for Project Plan
  const generateProjectPlan = async () => {
    if (!projectDetails.name || !projectDetails.budget || !projectDetails.deadline || !projectDetails.requirements) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true); // Show loader while fetching
    setProjectPlan(""); // Clear old plan

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

    try {
      const result = await chatSession.sendMessage(`
        Generate a detailed construction project plan with the following details:
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
        - Risk factors and mitigation strategies
      `);

      setProjectPlan(result.response.text());
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to generate project plan.");
    } finally {
      setLoading(false);
    }
  };

  const generateMilestone = async () => {
    if (!storedPlan) return;

    setMilestoneLoading(true);
    setMilestone(null);

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

    try {
      const result = await chatSession.sendMessage(`
        Based on the following project plan, generate a detailed milestone breakdown:
        
        ${storedPlan}

        The milestones should include:
        - Phase-wise breakdown (Planning, Foundation, Framing, Roofing, Interiors)
        - Specific tasks for each phase
        - Start and end dates relative to the deadline (${projectDetails.deadline}).
        - Expected time for each phase
      `);

      setMilestone(result.response.text());
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to generate milestones.");
    } finally {
      setMilestoneLoading(false);
    }
  };

  // 🔹 Function to Accept the Plan & Create Milestone
  const acceptProjectPlan = () => {
    setStoredPlan(projectPlan);
    Alert.alert("Success", "Project plan accepted. Generating milestones...");
    generateMilestone();
  };

  // 🔹 Function to Reject and Generate New Plan
  const rejectProjectPlan = () => {
    Alert.alert("Info", "Generating a new project plan...");
    generateProjectPlan();
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

          {/* Accept or Reject Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={acceptProjectPlan}>
              <Text style={styles.buttonText}>Accept Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={rejectProjectPlan}>
              <Text style={styles.buttonText}>Reject & Regenerate</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🔹 Loading Indicator for Milestones */}
      {milestoneLoading && <ActivityIndicator size="large" color="#28a745" />}

      {/* 🔹 Display Stored Plan and Milestone */}
      {milestone && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Milestone Breakdown</Text>
          <Text style={styles.text}>{milestone}</Text>
        </View>
      )}

      {/* 🔹 Logout Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Welcome")}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
