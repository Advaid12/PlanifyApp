import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import styles from "../../styles/AssignWorkers.styles";

export default function AssignWorkers({ navigation }) {
    const [milestones, setMilestones] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [workers, setWorkers] = useState([]);
    
    const [selectedMilestone, setSelectedMilestone] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");

    useEffect(() => {
        fetchMilestones();
        fetchWorkers();
    }, []);

    const fetchMilestones = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/milestones");
            setMilestones(response.data || []);
        } catch (error) {
            console.error("❌ Error fetching milestones:", error);
        }
    };

    const fetchTasks = async (milestoneId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/milestone-tasks?milestone_id=${milestoneId}`);
            setTasks(response.data || []);
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
        }
    };

    const fetchWorkers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/workers-available");
            setWorkers(response.data || []);
        } catch (error) {
            console.error("❌ Error fetching workers:", error);
        }
    };

    const assignWorker = async () => {
        if (!selectedMilestone || !selectedTask || !selectedWorker) {
            Alert.alert("Error", "❌ Please select a milestone, task, and worker.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/assign-worker", {
                milestone_id: selectedMilestone,
                task_id: selectedTask,
                worker_id: selectedWorker,
            });

            Alert.alert("✅ Success", response.data.message || "Worker assigned successfully!");
        } catch (error) {
            console.error("❌ Error assigning worker:", error);
            Alert.alert("Error", "❌ Failed to assign worker.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Assign Workers to Tasks</Text>

            {/* Milestone Selection */}
            <Text style={styles.label}>Select Milestone:</Text>
            <Picker 
                selectedValue={selectedMilestone} 
                onValueChange={(value) => {
                    setSelectedMilestone(value);
                    fetchTasks(value); // Fetch tasks when milestone changes
                }} 
                style={styles.picker}
            >
                <Picker.Item label="-- Select Milestone --" value="" />
                {milestones.map((milestone) => (
                    <Picker.Item key={milestone.milestone_id} label={milestone.name} value={milestone.milestone_id} />
                ))}
            </Picker>

            {/* Task Selection */}
            <Text style={styles.label}>Select Task:</Text>
            <Picker 
                selectedValue={selectedTask} 
                onValueChange={(value) => setSelectedTask(value)} 
                style={styles.picker}
            >
                <Picker.Item label="-- Select Task --" value="" />
                {tasks.map((task) => (
                    <Picker.Item key={task.task_id} label={task.task_name} value={task.task_id} />
                ))}
            </Picker>

            {/* Worker Selection */}
            <Text style={styles.label}>Select Worker:</Text>
            <Picker 
                selectedValue={selectedWorker} 
                onValueChange={(value) => setSelectedWorker(value)} 
                style={styles.picker}
            >
                <Picker.Item label="-- Select Worker --" value="" />
                {workers.map((worker) => (
                    <Picker.Item key={worker.id} label={worker.name} value={worker.id} />
                ))}
            </Picker>

            {/* Assign Button */}
            <TouchableOpacity style={styles.button} onPress={assignWorker}>
                <Text style={styles.buttonText}>✅ Assign Worker</Text>
            </TouchableOpacity>

            {/* View Milestones Button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ViewMilestone")}>
                <Text style={styles.buttonText}>➡ View Milestones</Text>
            </TouchableOpacity>
        </View>
    );
}
