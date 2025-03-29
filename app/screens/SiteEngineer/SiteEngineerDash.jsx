import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/SiteEngineer.styles";

const SiteEngineerProjectScreen = () => {
  const navigation = useNavigation();
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [status, setStatus] = useState("");
  const [budget, setBudget] = useState("");
  const [userId, setUserId] = useState("");
  const [sortBy, setSortBy] = useState("start_date");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (email) {
          const response = await axios.get(`http://localhost:5000/api/site-engineer/user-id?email=${email}`);
          if (response.data.user_id) {
            setUserId(response.data.user_id);
            fetchAssignedProjects(response.data.user_id);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchAssignedProjects = async (user_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/site-engineer/projects?user_id=${user_id}`);
      setAssignedProjects(response.data.projects || []);
    } catch (error) {
      console.error("❌ Error fetching assigned projects:", error);
    }
  };

  const fetchMilestones = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/project-details/${projectId}`);
      setMilestones(response.data.milestones || []);
    } catch (error) {
      console.error("❌ Error fetching milestones:", error);
      setMilestones([]);
    }
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    fetchMilestones(projectId);
  };

  const handleMilestoneSelect = (milestone) => {
    setSelectedMilestone(milestone);
    setStatus(milestone.milestone_status);
    setBudget(milestone.milestone_budget.toString());
  };

  const updateMilestone = async () => {
    if (!selectedMilestone) {
      Alert.alert("Error", "❌ Please select a milestone.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/update-milestone/${selectedMilestone.milestone_id}`, {
        status,
        milestone_budget: budget,
      });

      Alert.alert("Success", response.data.message || "✅ Milestone updated successfully!");
      fetchMilestones(selectedProject);
    } catch (error) {
      console.error("❌ Error updating milestone:", error);
      Alert.alert("Error", "❌ Failed to update milestone.");
    }
  };

  const sortMilestones = (a, b) => {
    switch (sortBy) {
      case "start_date":
        return new Date(a.milestone_start) - new Date(b.milestone_start);
      case "status":
        const statusOrder = { "In Progress": 1, Due: 2, Finished: 3 };
        return statusOrder[a.milestone_status] - statusOrder[b.milestone_status];
      case "budget":
        return a.milestone_budget - b.milestone_budget;
      default:
        return 0;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addProjectButton} onPress={() => navigation.navigate("AddProjectScreen")}>
        <Text style={styles.addProjectButtonText}>Add Project</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Project & Milestone Management</Text>

      <Text style={styles.label}>Select a Project:</Text>
      <Picker selectedValue={selectedProject} onValueChange={handleProjectSelect} style={styles.picker}>
        <Picker.Item label="-- Select Project --" value="" />
        {assignedProjects.map((project) => (
          <Picker.Item key={project.project_id} label={project.project_id} value={project.project_id} />
        ))}
      </Picker>

      <Text style={styles.label}>Sort By:</Text>
      <Picker selectedValue={sortBy} onValueChange={setSortBy} style={styles.picker}>
        <Picker.Item label="Start Date" value="start_date" />
        <Picker.Item label="Status" value="status" />
        <Picker.Item label="Budget" value="budget" />
      </Picker>

      {milestones.length > 0 ? (
        <FlatList
          data={milestones.sort(sortMilestones)}
          keyExtractor={(item) => item.milestone_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.milestoneCard} onPress={() => handleMilestoneSelect(item)}>
              <Text style={styles.milestoneTitle}>📌 {item.milestone_name}</Text>
              <Text style={styles.milestoneDetail}>Status: <Text style={styles.bold}>{item.milestone_status}</Text></Text>
              <Text style={styles.milestoneDetail}>Budget: <Text style={styles.bold}>₹{item.milestone_budget}</Text></Text>
              <Text style={styles.milestoneDetail}>Start Date: <Text style={styles.bold}>{item.milestone_start || "N/A"}</Text></Text>
              <Text style={styles.milestoneDetail}>Deadline: <Text style={styles.bold}>{item.milestone_deadline || "N/A"}</Text></Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noMilestoneText}>No milestones available.</Text>
      )}
    </View>
  );
};

export default SiteEngineerProjectScreen;
