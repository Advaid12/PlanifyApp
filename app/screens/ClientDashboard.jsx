import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles/ClientDashboard.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Initialize Google AI Model
const apiKey = "AIzaSyC-OnBnrVq0nEF0uuGHwf-NTqWdjbW1Sk4";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const saveEmail = async (userEmail) => {
  try {
    const emailJson = JSON.stringify({ email: userEmail }); // Convert email to JSON
    await AsyncStorage.setItem("userEmail", emailJson);
    console.log("✅ Email saved:", emailJson);
  } catch (error) {
    console.error("❌ Error saving email:", error);
  }
};


export default function ClientDashboard() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    id: "",
    budget: "",
    beginningDate: "",
    deadline: "",
    requirements: "",
  });

  const [projectPlan, setProjectPlan] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  // ✅ Fetch email from AsyncStorage
  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };
    fetchEmail();
  }, []);

  // ✅ Generate Project Plan with Milestones
  const generateProjectPlan = async () => {
    if (
      !projectDetails.name ||
      !projectDetails.budget ||
      !projectDetails.beginningDate ||
      !projectDetails.deadline ||
      !projectDetails.requirements
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    setProjectPlan("");
    setMilestones([]);
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

      const prompt = `Generate a **detailed construction project plan** including:
        - Project Name: ${projectDetails.name}
        - Project ID: ${projectDetails.id}
        - Budget: ${projectDetails.budget} INR
        - Start Date: ${projectDetails.beginningDate}
        - Deadline: ${projectDetails.deadline}
        - Requirements: ${projectDetails.requirements}

        **Project Plan Must Include**:
        1️⃣ Overview
        2️⃣ Key Phases (Excavation, Foundation, Roofing, etc.)
        3️⃣ Budget Breakdown
        4️⃣ Timeline
        5️⃣ Resources Required
        6️⃣ Risks & Mitigation Strategies

        **Milestones (Valid JSON format at the end)**:
        {
          "milestones": [
            { "name": "Site Preparation", "beginningDate": "2025-04-01", "deadline": "2025-04-05", "budget": 50000, "deliverable": "Cleared and leveled site" },
            { "name": "Foundation Completed", "beginningDate": "2025-04-06", "deadline": "2025-04-15", "budget": 150000, "deliverable": "Concrete foundation ready" },
            { "name": "Structural Framing", "beginningDate": "2025-04-16", "deadline": "2025-05-05", "budget": 200000, "deliverable": "Steel framework completed" }
          ]
        }`;

      const result = await chatSession.sendMessage(prompt);

      if (!result?.response?.text) throw new Error("Invalid response from Gemini API.");

      let responseText = result.response.text();
      console.log("📌 Raw API Response:", responseText);

      // ✅ Extract JSON Milestone Section
      const milestoneRegex = /```json([\s\S]*?)```/;
      const match = responseText.match(milestoneRegex);

      let parsedMilestones = [];
      if (match) {
        try {
          const jsonString = match[1].trim();
          const validJsonString = jsonString.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

          console.log("📌 Extracted JSON:", validJsonString);

          const jsonData = JSON.parse(validJsonString);
          parsedMilestones = jsonData.milestones || [];
        } catch (error) {
          console.error("❌ JSON Parsing Error:", error);
          Alert.alert("Error", "Failed to parse milestones.");
        }
      }

      setProjectPlan(responseText.replace(milestoneRegex, "").trim());
      setMilestones(parsedMilestones);
      setPlanGenerated(true);
    } catch (error) {
      console.error("❌ API Error:", error);
      Alert.alert("Error", "Failed to connect to Gemini API.");
    } finally {
      setLoading(false);
    }
  };
  console.log(email)
  // ✅ Accept Plan & Save to Backend
  const handleAcceptPlan = async () => {
    if (!projectPlan) {
      Alert.alert("Error", "No plan to accept.");
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        project_id: projectDetails.id,
        name: projectDetails.name,
        budget: projectDetails.budget,
        beginningDate: projectDetails.beginningDate,
        deadline: projectDetails.deadline,
        email: email.replace(/"/g, ""),
      };

      await axios.post("http://localhost:5000/api/save-project-details", projectData);

      if (milestones.length > 0) {
        await Promise.all(
          milestones.map((milestone) =>
            axios.post("http://localhost:5000/api/save-milestone", {
              project_id: projectDetails.id,
              milestone_name: milestone.name,
              description: milestone.deliverable || "No description",
              budget: milestone.budget || 0,
              beginningDate: milestone.beginningDate,
              deadline: milestone.deadline,
              status: "pending",
            })
          )
        );
      }

      Alert.alert("Success", "Project and milestones saved successfully!");
    } catch (error) {
      console.error("❌ Error saving project:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to save project details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reject Plan
  const handleRejectPlan = () => {
    setProjectPlan("");
    setMilestones([]);
    setPlanGenerated(false);
    Alert.alert("Plan Rejected", "Please resubmit your project details.");
  };

  return (
    <ScrollView style={styles.container}>
      {/* ✅ Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome, {email}!</Text>
      </View>

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

          <Text style={styles.subHeader}>🚀 Project Milestones</Text>
          {milestones.map((milestone, index) => (
            <Text key={index} style={styles.milestoneItem}>
              🔹 {milestone.name} - {milestone.beginningDate} to {milestone.deadline}
            </Text>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleAcceptPlan}>
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

