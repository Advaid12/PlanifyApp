import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import styles from "../../styles/ViewMilestone.styles";

export default function ViewMilestones() {
    const [milestones, setMilestones] = useState([]);
    const [projectId, setProjectId] = useState(""); // State for project_id
    const [hasFetched, setHasFetched] = useState(false); // Tracks if data was fetched

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
            <Text style={styles.title}>Milestone Status</Text>

            {/* Project ID Input Field */}
            <TextInput
                style={styles.input}
                placeholder="Enter Project ID"
                value={projectId}
                onChangeText={setProjectId}
            />
            <Button title="Fetch Milestones" onPress={fetchMilestones} />

            {/* Show milestones only after fetching */}
            {hasFetched && milestones.length > 0 ? (
                <>
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
                    {/* Clear Button */}
                    <TouchableOpacity style={styles.clearButton} onPress={clearMilestones}>
                        <Text style={styles.clearButtonText}>❌ Clear Milestones</Text>
                    </TouchableOpacity>
                </>
            ) : hasFetched && milestones.length === 0 ? (
                <Text style={styles.noDataText}>No milestones found for this project.</Text>
            ) : null}
        </View>
    );
}
