import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/ClientHome.styles";

export default function ViewMilestones() {
    const navigation = useNavigation();
    const [milestones, setMilestones] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [hasFetched, setHasFetched] = useState(false);
    
    const fetchMilestones = async () => {
        if (!projectId.trim()) {
            console.error("❌ Please enter a project ID.");
            return;
        }
        try {
            const url = `http://localhost:5000/api/contractor/milestones?project_id=${projectId}`;
            const response = await axios.get(url);
            setMilestones(response.data || []);
            setHasFetched(true);
        } catch (error) {
            console.error("❌ Error fetching milestones:", error);
        }
    };

    const clearMilestones = () => {
        setProjectId("");
        setMilestones([]);
        setHasFetched(false);
    };

    return (
        <View style={styles.container}>
            {/* Top Right Buttons */}
            {/* <View style={styles.topButtonsContainer}>
                <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate("ContractorDashboard")}> 
                    <Text style={styles.topButtonText}>Add Project</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate("AssignWorkers")}> 
                    <Text style={styles.topButtonText}>Assign Task</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate("WorkerManagement")}> 
                    <Text style={styles.topButtonText}>Update Worker Count</Text>
                </TouchableOpacity>
            </View> */}

            {/* ✅ Add Project Button */}
            {/* <View style={styles.topButtonsContainer}>
                <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate("ClientDashboard")}>
                    <Text style={styles.topButtonText}>➕ Add Project</Text>
                </TouchableOpacity>
            </View> */}

            <Text style={styles.title}>Milestone Status</Text>
            <TextInput style={styles.input} placeholder="Enter Project ID" value={projectId} onChangeText={setProjectId} />
            <Button title="Fetch Milestones" onPress={fetchMilestones} />
            
            {hasFetched && milestones.length > 0 ? (
                <FlatList
                    data={milestones}
                    keyExtractor={(item) => item.milestone_id}
                    renderItem={({ item }) => (
                        <View style={styles.milestoneCard}>
                            <Text style={styles.milestoneText}>📌 {item.milestone_name}</Text>
                            <Text>Status: {item.status}</Text>
                        </View>
                    )}
                />
            ) : hasFetched && milestones.length === 0 ? (
                <Text style={styles.noDataText}>No milestones found for this project.</Text>
            ) : null}

            {hasFetched && (
                <TouchableOpacity style={styles.clearButton} onPress={clearMilestones}>
                    <Text style={styles.clearButtonText}>❌ Clear Milestones</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
