import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../styles/ClientDashboard.styles";

// Initialize Google AI Model
const apiKey = "AIzaSyB3EzlaDTWttmIag3G-VemU8pKqFFp4vEI";
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
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

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
            { "name": "Structural Framing", "beginningDate": "2025-04-16", "deadline": "2025-05-05", "budget": 200000, "deliverable": "Steel framework completed" },
            { "name": "Roof Installation", "beginningDate": "2025-05-06", "deadline": "2025-05-25", "budget": 100000, "deliverable": "Roofing completed" },
            { "name": "Final Inspection", "beginningDate": "2025-06-01", "deadline": "2025-06-10", "budget": 50000, "deliverable": "Ready for handover" }
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
          Alert.alert("Error", "Failed to parse milestones. Check JSON formatting.");
        }
      } else {
        console.error("❌ No JSON found in response.");
        Alert.alert("Error", "No milestones found in the response.");
      }
  
      // ✅ Remove JSON from Plan Text
      const cleanProjectPlan = responseText.replace(milestoneRegex, "").trim();
  
      setProjectPlan(cleanProjectPlan);
      setMilestones(parsedMilestones);
      setPlanGenerated(true);
    } catch (error) {
      console.error("❌ API Error:", error);
      Alert.alert("Error", "Failed to connect to Gemini API.");
    } finally {
      setLoading(false);
    }
  };
  
  

  // ✅ Accept Plan & Save to Backend
  // ✅ Accept Plan & Save to Backend
  const handleAcceptPlan = async () => {
    if (!projectPlan) {
      Alert.alert("Error", "No plan to accept.");
      return;
    }
  
    setLoading(true);
  
    try {
      // ✅ Extract Project Data
      const projectData = {
        project_id: projectDetails.id,
        name: projectDetails.name,
        budget: projectDetails.budget,
        beginningDate: projectDetails.beginningDate,
        deadline: projectDetails.deadline,
      };
  
      console.log("📌 Saving Project Data:", projectData);
  
      // ✅ Save Project to Backend
      await axios.post("http://localhost:5000/api/save-project-details", projectData);
  
      // ✅ Parse Milestone Data from Console
      console.log("📌 Raw Milestones from Console:", milestones); // Debugging
  
      const parsedMilestones = milestones.map((milestone) => ({
        project_id: projectDetails.id, // Ensure project ID is linked
        milestone_name: milestone.name, // Backend requires 'milestone_name'
        description: milestone.deliverable || "No description", // Ensure description exists
        budget: milestone.budget || 0, // Default to 0 if missing
        beginningDate: milestone.beginningDate, // Use 'beginningDate'
        deadline: milestone.deadline, // Use 'deadline'
        status: "In Progress", // Default status
      }));
  
      console.log("📌 Parsed Milestones Data:", parsedMilestones); // Debugging
  
      // ✅ Save Milestones to Backend
      if (parsedMilestones.length > 0) {
        await Promise.all(
          parsedMilestones.map((milestone) =>
            axios.post("http://localhost:5000/api/save-milestone", milestone)
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
            <View key={index} style={styles.milestoneItem}>
              <Text style={styles.milestoneTitle}>🔹 {milestone.name}</Text>
              <Text style={styles.milestoneDate}>📅 Start: {milestone.beginningDate} | End: {milestone.deadline}</Text>
              <Text style={styles.milestoneDeliverable}>✅ {milestone.deliverable}</Text>
            </View>
          ))}

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
