import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import styles from "../../styles/AssignWorkers.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:5000"; // Change X.X to your local IP

export default function AssignWorkers({ navigation }) {
    const [projects, setProjects] = useState([]);
    const [milestones, setMilestones] = useState([]);
    
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedMilestone, setSelectedMilestone] = useState("");
    const [numWorkers, setNumWorkers] = useState("");

    const [loading, setLoading] = useState(false);
    //fetch project
    useEffect(() => {
        const fetchUserIdAndProjects = async () => {
            try {
                const email = await AsyncStorage.getItem("userEmail"); // Get saved email
            if (!email) {
                console.error("Email not found in storage");
                return;
            }
    
                // First, get user_id from backend
                const userIdResponse = await axios.get(`${API_BASE_URL}/api/contractor/user-id`, {
                    params: { email }
                });
    
                const userId = userIdResponse.data.user_id?.trim();
                console.log("✅ Got user_id:", userId);
    
                if (!userId) {
                    console.error("No user ID received");
                    return;
                }
    
                // Now fetch projects using user_id
                const projectsResponse = await axios.get(`${API_BASE_URL}/api/projects`, {
                    params: { user_id: userId }
                });
    
                setProjects(projectsResponse.data || []);
            } catch (error) {
                console.error("❌ Error fetching user_id or projects:", error);
                Alert.alert("Error", "Failed to load projects.");
            } finally {
                setLoading(false);
            }
        };
    
        setLoading(true);
        fetchUserIdAndProjects();
    }, []);
    

    // ✅ Fetch milestones when project is selected
    const fetchMilestones = async (projectId) => {
        if (!projectId) return; // Prevent unnecessary API calls

        try {
            setLoading(true);

            const response = await axios.get(`${API_BASE_URL}/api/milestones?project_id=${projectId}`);
            const fetchedMilestones = response.data || [];

            console.log("✅ Fetched Milestones:", fetchedMilestones);

            setMilestones(fetchedMilestones);

            if (fetchedMilestones.length > 0) {
                setSelectedMilestone(fetchedMilestones[0].milestone_id); // Auto-select first milestone
            } else {
                setSelectedMilestone(""); // Clear selection if no milestones
            }
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
            const email = await AsyncStorage.getItem("userEmail");
            if (!email) {
                Alert.alert("Error", "❌ Contractor email not found.");
                return;
            }
    
            // Fetch contractor ID
            const userIdResponse = await axios.get(`${API_BASE_URL}/api/contractor/user-id`, {
                params: { email }
            });
    
            const contractor_id = userIdResponse.data.user_id?.trim();
    
            if (!contractor_id) {
                Alert.alert("Error", "❌ Could not fetch contractor ID.");
                return;
            }
    
            // Now send the assignment request
            const response = await axios.post(`${API_BASE_URL}/api/assign-workers`, {
                contractor_id,
                project_id: selectedProject,
                milestone_name: selectedMilestone,
                num_workers: parseInt(numWorkers),
            });
    
            Alert.alert("✅ Success", response.data.message || "Workers assigned successfully!");
        } catch (error) {
            console.error("❌ Error assigning workers:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.error || "❌ Failed to assign workers.");
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

            <Picker
                selectedValue={selectedMilestone}
                onValueChange={(value) => setSelectedMilestone(value)}
                style={styles.picker}
                enabled={!!selectedProject}
            >
                <Picker.Item label="-- Select Milestone --" value="" />
                {milestones.map((milestone) => (
                    <Picker.Item
                        key={milestone.milestone_id}
                        label={milestone.milestone_name}   // shown in dropdown
                        value={milestone.milestone_name}   // value passed when selected
                    />
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
