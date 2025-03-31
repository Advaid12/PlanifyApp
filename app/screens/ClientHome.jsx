import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; // ✅ Import Picker for dropdown
import styles from "../styles/ClientHome.styles"; // Ensure this file exists

export default function ClientHome() {
  const navigation = useNavigation();
  const [projectID, setProjectID] = useState(""); // ✅ Store user input
  const [selectedProject, setSelectedProject] = useState(""); // ✅ Store selected project
  const [projects, setProjects] = useState(["Project A", "Project B", "Project C"]); // Example projects

  useEffect(() => {
    console.log("Navigated to ClientHome");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Client Portal</Text>

      {/* ✅ Enter Project ID Section */}
      <Text style={styles.label}>Enter Project ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Project ID"
        value={projectID}
        onChangeText={(text) => setProjectID(text)}
      />

      {/* ✅ Select a Project Dropdown */}
      <Text style={styles.label}>Select a Project</Text>
      <Picker
        selectedValue={selectedProject}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedProject(itemValue)}
      >
        <Picker.Item label="Choose a project" value="" />
        {projects.map((project, index) => (
          <Picker.Item key={index} label={project} value={project} />
        ))}
      </Picker>

      {/* ✅ Add Project Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ClientDashboard")}
      >
        <Text style={styles.buttonText}>Add Project</Text>
      </TouchableOpacity>
    </View>
  );
}
