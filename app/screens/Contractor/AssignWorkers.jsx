import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import styles from "../../styles/AssignWorkers.styles";

const API_BASE_URL = "http://localhost:5000"; // Change X.X to your local IP

export default function AssignWorkers({ navigation }) {
    const [projects, setProjects] = useState([]);
    const [milestones, setMilestones] = useState([]);
    
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedMilestone, setSelectedMilestone] = useState("");
    const [numWorkers, setNumWorkers] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    // ✅ Fetch available projects
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/projects`);
            setProjects(response.data || []);
        } catch (error) {
            console.error("❌ Error fetching projects:", error);
            Alert.alert("Error", "Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch milestones when project is selected
    const fetchMilestones = async (projectId) => {
        if (!projectId) return; // Prevent unnecessary API calls

        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/milestones?project_id=${projectId}`);
            setMilestones(response.data || []);
            setSelectedMilestone(""); // Reset milestone when project changes
        } catch (error) {
            console.error("❌ Error fetching milestones:", error);
            Alert.alert("Error", "Failed to load milestones.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Assign workers to a milestone
    const assignWorkers = async () => {
        if (!selectedProject || !selectedMilestone || !numWorkers) {
            Alert.alert("Error", "❌ Please select a project, milestone, and enter the number of workers.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/assign-workers`, {
                project_id: selectedProject,
                milestone_id: selectedMilestone,
                num_workers: parseInt(numWorkers),
            });

            Alert.alert("✅ Success", response.data.message || "Workers assigned successfully!");
        } catch (error) {
            console.error("❌ Error assigning workers:", error);
            Alert.alert("Error", "❌ Failed to assign workers.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Assign Workers to Milestones</Text>

            {/* Project Selection */}
            <Text style={styles.label}>Select Project:</Text>
            <Picker
                selectedValue={selectedProject}
                onValueChange={(value) => {
                    setSelectedProject(value);
                    fetchMilestones(value); // Fetch milestones when project changes
                }}
                style={styles.picker}
            >
                <Picker.Item label="-- Select Project --" value="" />
                {projects.map((project) => (
                    <Picker.Item key={project.id} label={project.name} value={project.id} />
                ))}
            </Picker>

            {/* Milestone Selection */}
            <Text style={styles.label}>Select Milestone:</Text>
            <Picker
                selectedValue={selectedMilestone}
                onValueChange={(value) => setSelectedMilestone(value)}
                style={styles.picker}
                enabled={!!selectedProject} // Disable if no project selected
            >
                <Picker.Item label="-- Select Milestone --" value="" />
                {milestones.map((milestone) => (
                    <Picker.Item key={milestone.milestone_id} label={milestone.name} value={milestone.milestone_id} />
                ))}
            </Picker>

            {/* Number of Workers */}
            <Text style={styles.label}>Number of Workers:</Text>
            <TextInput
                value={numWorkers}
                onChangeText={setNumWorkers}
                keyboardType="numeric"
                placeholder="Enter number of workers"
                style={styles.input}
            />

            {/* Assign Button */}
            <TouchableOpacity style={styles.button} onPress={assignWorkers}>
                <Text style={styles.buttonText}>✅ Assign Workers</Text>
            </TouchableOpacity>

            {/* View Milestones Button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ViewMilestone")}>
                <Text style={styles.buttonText}>➡ View Milestones</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="blue" />}
        </View>
    );
}
