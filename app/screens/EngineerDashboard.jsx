import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Store engineer's email
import styles from "../styles/EngineerDashboard.styles";

export default function SiteEngineerDashboard() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [projectIdInput, setProjectIdInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // Toggle menu
  const [engineerEmail, setEngineerEmail] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchEngineerEmail(); // Fetch engineer email on load
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMilestones();
    }
  }, [selectedProject]);

  // ✅ Fetch engineer email from AsyncStorage
  const fetchEngineerEmail = async () => {
    try {
      const emailJson = await AsyncStorage.getItem("userEmail");
      if (emailJson) {
        const { email } = JSON.parse(emailJson);
        setEngineerEmail(email);
      }
    } catch (error) {
      console.error("Error fetching engineer email:", error);
    }
  };

  // ✅ Fetch project IDs
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // ✅ Fetch milestones for selected project
  const fetchMilestones = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/milestones/${selectedProject}`);
      setMilestones(response.data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  // ✅ Handle Project ID submission
  const handleProjectSubmit = () => {
    if (projectIdInput.trim()) {
      setSelectedProject(projectIdInput.trim());
      setProjectIdInput("");
      setMenuOpen(false); // Close menu after selecting project
    } else {
      Alert.alert("Error", "Please enter a valid Project ID.");
    }
  };

  // ✅ Update milestone status and cost
  const updateMilestone = async (milestoneId, status, cost) => {
    try {
      await axios.post("http://localhost:5000/api/milestones/update-status", {
        milestoneId,
        status,
        cost,
        projectId: selectedProject,
        engineerEmail, // ✅ Send engineer email to backend
      });

      Alert.alert("Success", "Milestone updated successfully!");
      fetchMilestones();
    } catch (error) {
      console.error("Error updating milestone:", error);
      Alert.alert("Error", "Failed to update milestone.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Hamburger Menu */}
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(!menuOpen)}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      {/* ✅ Menu for adding Project ID */}
      {menuOpen && (
        <View style={styles.menuContainer}>
          <Text style={styles.menuLabel}>Enter Project ID:</Text>
          <TextInput
            style={styles.input}
            value={projectIdInput}
            onChangeText={setProjectIdInput}
            placeholder="Project ID"
          />
          <TouchableOpacity style={styles.button} onPress={handleProjectSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ Project Selector */}
      <Text style={styles.subHeader}>Select Project</Text>
      <Picker selectedValue={selectedProject} onValueChange={setSelectedProject} style={styles.picker}>
        {projects.map((project) => (
          <Picker.Item key={project.project_id} label={project.project_id} value={project.project_id} />
        ))}
      </Picker>

      {/* ✅ Display Milestones */}
      <Text style={styles.subHeader}>Milestones</Text>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {milestones.length > 0 ? (
        milestones.map((milestone) => (
          <View key={milestone.milestone_id} style={styles.milestoneCard}>
            <Text style={styles.milestoneText}>📌 {milestone.name}</Text>
            <Text style={styles.milestoneDesc}>{milestone.description}</Text>
            <Text style={styles.milestoneDeadline}>Deadline: {milestone.deadline}</Text>

            <TextInput
              style={styles.input}
              placeholder="Status"
              onChangeText={(text) => updateMilestone(milestone.milestone_id, text, milestone.cost)}
            />
            <TextInput
              style={styles.input}
              placeholder="Milestone Cost"
              keyboardType="numeric"
              onChangeText={(text) => updateMilestone(milestone.milestone_id, milestone.status, text)}
            />
          </View>
        ))
      ) : (
        <Text style={styles.noTasks}>No milestones available for this project.</Text>
      )}
    </View>
  );
}
