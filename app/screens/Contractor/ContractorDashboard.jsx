import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import styles from "../../styles/ContractorDashboard.styles"; // Ensure your styles exist

const ContractorDashboard = () => {
  const [projects, setProjects] = useState([]); // List of available projects
  const [selectedProject, setSelectedProject] = useState(""); // Selected project ID
  const [message, setMessage] = useState(""); // Success/Error messages
  const [userEmail, setUserEmail] = useState(""); // Store logged-in user email
  const [userId, setUserId] = useState(""); // Store logged-in user ID
  const [assignedProjects, setAssignedProjects] = useState([]); 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (email) {
          setUserEmail(email);
          const response = await axios.get(`http://localhost:5000/api/contractor/user-id?email=${email}`);
          if (response.data.user_id) {
            setUserId(response.data.user_id);
            fetchProjects(response.data.user_id);
            fetchAssignedProjects(response.data.user_id);
          } else {
            console.error("❌ Error: User ID not found for this email");
          }
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchProjects = async (user_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/contractor/available-projects?user_id=${user_id}`);
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      setProjects([]);
    }
  };

  const fetchAssignedProjects = async (user_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/contractor/projects?user_id=${user_id}`);
      setAssignedProjects(response.data.projects || []);
    } catch (error) {
      console.error("❌ Error fetching assigned projects:", error);
    }
  };

  const assignProject = async () => {
    if (!selectedProject) {
      Alert.alert("Error", "❌ Please select a project.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/contractor/assign-project", {
        contractor_id: userId,
        project_id: selectedProject,
      });

      Alert.alert("Success", response.data.message || "✅ Project assigned successfully!");
      setMessage(response.data.message || "✅ Project assigned successfully!");
      fetchAssignedProjects(userId); // Refresh assigned projects
    } catch (error) {
      console.error("❌ Error assigning project:", error);
      Alert.alert("Error", "❌ Failed to assign project.");
    }
  };

  const removeProject = async (projectId) => {
    try {
      const response = await axios.delete("http://localhost:5000/api/contractor/remove-project", {
        data: { contractor_id: userId, project_id: projectId },
      });

      Alert.alert("Success", response.data.message || "✅ Project removed successfully!");
      fetchAssignedProjects(userId); // Refresh assigned projects
    } catch (error) {
      console.error("❌ Error removing project:", error);
      Alert.alert("Error", "❌ Failed to remove project.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏗 Contractor Dashboard</Text>
      <Text style={styles.label}>Email: {userEmail}</Text>
      <Text style={styles.label}>User ID: {userId}</Text>

      <Text style={styles.label}>Available Projects:</Text>
      <FlatList
        data={assignedProjects}
        keyExtractor={(item) => item.project_id}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Text style={styles.listItem}>📌 {item.project_id}</Text>
            <Button title="Remove" onPress={() => removeProject(item.project_id)} />    
          </View>
        )}
      />

      <Text style={styles.label}>Select a Project:</Text>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(itemValue) => setSelectedProject(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Project --" value="" />
        {projects.map((project) => (
          <Picker.Item key={project.project_id} label={project.project_id} value={project.project_id} />
        ))}
      </Picker>

      <Button title="Manage Project" onPress={assignProject} />
      
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

export default ContractorDashboard;
