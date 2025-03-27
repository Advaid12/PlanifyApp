import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import styles from "../styles/EngineerDashboard.styles";

export default function SiteEngineerDashboard() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]); // Store project IDs
  const [selectedProject, setSelectedProject] = useState(null); // Selected project ID
  const [milestones, setMilestones] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMilestones();
      fetchBudgetStatus();
      fetchWorkers();
    }
  }, [selectedProject]);

  // ✅ Fetch project IDs from database
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0].project_id); // Default to first project
      }
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
  
  // ✅ Fetch budget status for selected project
  const fetchBudgetStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/budget-status/${selectedProject}`);
      setBudgetStatus(response.data);
    } catch (error) {
      console.error("Error fetching budget status:", error);
    }
  };
  

  // ✅ Fetch available workers
  const fetchWorkers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/workers-available");
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  // ✅ Upload site image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // ✅ Submit site image to backend
  const uploadImage = async (milestoneId) => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("milestone_id", milestoneId);
      formData.append("project_id", selectedProject);
      formData.append("site_image", {
        uri: selectedImage,
        name: "site_image.jpg",
        type: "image/jpeg",
      });

      await axios.post("http://localhost:5000/api/upload-site-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Site image uploaded successfully!");
      setSelectedImage(null);
      fetchMilestones();
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Site Engineer Dashboard</Text>
      {/* ✅ Project Dropdown */}
      <Text style={styles.subHeader}>Select Project</Text>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(itemValue) => setSelectedProject(itemValue)}
        style={styles.picker}
      >
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

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Select Site Image</Text>
            </TouchableOpacity>

            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}

            <TouchableOpacity style={styles.submitButton} onPress={() => uploadImage(milestone.milestone_id)}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noTasks}>No milestones available for this project.</Text>
      )}
    </ScrollView>
  );
}