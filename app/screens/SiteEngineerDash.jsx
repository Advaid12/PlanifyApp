import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import styles from "../styles/SiteEngineer.styles";

export default function SiteEngineer() {
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const emailJson = await AsyncStorage.getItem("userEmail");
        if (emailJson) {
          const email = JSON.parse(emailJson)?.email;
          setUserEmail(email);
        }
      } catch (error) {
        console.error("❌ Error fetching email:", error);
      }
    };
    fetchEmail();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects");
      const data = await response.json();
      setProjectList(data.projects.map(item => item.project_id));
    } catch (error) {
      Alert.alert("Error", "Failed to fetch project IDs.");
    }
  };

  const fetchMilestones = async (projectId) => {
    setSelectedProject(projectId);
    try {
      const response = await fetch(`http://localhost:5000/api/site-engineer/project/${projectId}`);
      const data = await response.json();
      setMilestones(data.milestones);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch milestones.");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/site-engineer/milestone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentMilestone, email: userEmail, project_id: selectedProject }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        fetchMilestones(selectedProject);
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update milestone.");
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Site Engineer</Text>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(itemValue) => fetchMilestones(itemValue)}
      >
        <Picker.Item label="Select a Project" value={null} />
        {projectList.map((project) => (
          <Picker.Item key={project} label={project} value={project} />
        ))}
      </Picker>
      <FlatList
        data={milestones}
        keyExtractor={(item) => item.milestone_name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            setCurrentMilestone(item);
            setModalVisible(true);
          }}>
            <Text>{item.milestone_name} - {item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={isModalVisible}>
        <TextInput 
          value={currentMilestone?.status} 
          onChangeText={(text) => setCurrentMilestone({ ...currentMilestone, status: text })} 
          placeholder="Update Status (Completed, In Progress, Started)"
        />
        <TouchableOpacity onPress={handleUpdate}>
          <Text>Update Milestone</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
