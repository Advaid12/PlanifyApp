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
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  // Generate project plan with milestones
  const generateProjectPlan = async () => {
    if (!projectDetails.name || !projectDetails.budget || !projectDetails.beginningDate || !projectDetails.deadline || !projectDetails.requirements) {
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

      const prompt = `Generate a **detailed construction project plan** with the following details:
      - **Project Name**: ${projectDetails.name}
      - **Project ID**: ${projectDetails.id}
      - **Budget**: ${projectDetails.budget} INR
      - **Start Date**: ${projectDetails.beginningDate}
      - **Deadline**: ${projectDetails.deadline}
      - **Requirements**: ${projectDetails.requirements}

      **Project Plan Must Include**:
      1️⃣ Overview  
      2️⃣ Key Phases (Excavation, Foundation, Roofing, etc.)  
      3️⃣ Budget Breakdown  
      4️⃣ Timeline  
      5️⃣ Resources Required  
      6️⃣ Risks & Mitigation Strategies  

      **Milestones** (in valid JSON format at the end):
      {
        "milestones": [
          { "name": "Site Preparation", "date": "2025-04-01", "deliverable": "Cleared and leveled site" },
          { "name": "Foundation Completed", "date": "2025-04-15", "deliverable": "Concrete foundation ready" },
          { "name": "Structural Framing", "date": "2025-05-10", "deliverable": "Steel framework completed" },
          { "name": "Roof Installation", "date": "2025-05-25", "deliverable": "Roofing completed" },
          { "name": "Final Inspection", "date": "2025-06-10", "deliverable": "Ready for handover" }
        ]
      }`;

      const result = await chatSession.sendMessage(prompt);

      if (!result || !result.response || !result.response.text) {
        throw new Error("Invalid response from Gemini API.");
      }

      let responseText = result.response.text();
      console.log("Raw API Response:", responseText);

      // ✅ Remove unwanted markdown formatting
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

      // ✅ Extract milestones using regex
      const milestoneRegex = /{[\s\S]*}/;
      const milestoneMatch = responseText.match(milestoneRegex);

      let parsedMilestones = [];
      if (milestoneMatch) {
        try {
          const jsonString = milestoneMatch[0];
          const jsonData = JSON.parse(jsonString);
          parsedMilestones = jsonData.milestones || [];
        } catch (error) {
          console.error("JSON Parsing Error:", error);
          Alert.alert("Error", "Failed to parse milestones.");
        }
      }

      // ✅ Extract the main project plan without the milestones JSON
      const cleanProjectPlan = responseText.replace(milestoneRegex, "").trim();

      setProjectPlan(cleanProjectPlan);
      setMilestones(parsedMilestones);
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
        beginningDate: projectDetails.beginningDate,
        deadline: projectDetails.deadline,
        milestones: milestones, // ✅ Save milestones along with the project
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

          <Text style={styles.subHeader}>Milestones</Text>
          {milestones.map((milestone, index) => (
            <View key={index} style={styles.milestoneItem}>
              <Text style={styles.text}>🔹 {milestone.name} - {milestone.date}</Text>
              <Text style={styles.text}>📌 {milestone.deliverable}</Text>
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
