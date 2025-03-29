import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/WorkerManagement.styles";

export default function WorkerManagement() {
    const navigation = useNavigation();
    const [totalWorkers, setTotalWorkers] = useState("");
    const [availableWorkers, setAvailableWorkers] = useState("");
    const [user_id, setContractorId] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = await AsyncStorage.getItem("userEmail");
                if (email) {
                    const response = await axios.get(`http://localhost:5000/api/contractor/user-id?email=${email}`);
                    if (response.data.contractor_id) {
                        setContractorId(response.data.user_id);
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching contractor data:", error);
            }
        };
        fetchUserData();
    }, []);

    const updateWorkerCount = async () => {
        const payload = {
            contractor_id: user_id,  // Ensure this is NOT empty
            total_workers: Number(totalWorkers),  // Convert to Number
            available_workers: Number(availableWorkers)  // Convert to Number
        };
    
        console.log("🔍 Sending Data:", payload);  // Log data before sending
    
        if (!payload.contractor_id || !payload.total_workers || !payload.available_workers) {
            Alert.alert("❌ Error", "All fields are required!");
            return;
        }
    
        try {
            const response = await axios.put(
                "http://localhost:5000/api/contractor/update-workers",
                payload
            );
    
            Alert.alert("✅ Success", "Worker count updated!");
        } catch (error) {
            console.error("❌ Error updating worker count:", error.response?.data || error);
            Alert.alert("❌ Error", error.response?.data?.error || "Failed to update worker count.");
        }
    };
    
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contractor Dashboard</Text>

            <TextInput
                style={styles.input}
                placeholder="Total Workers"
                keyboardType="numeric"
                value={totalWorkers}
                onChangeText={setTotalWorkers}
            />

            <TextInput
                style={styles.input}
                placeholder="Available Workers"
                keyboardType="numeric"
                value={availableWorkers}
                onChangeText={setAvailableWorkers}
            />

            <TouchableOpacity style={styles.button} onPress={updateWorkerCount}>
                <Text style={styles.buttonText}>✅ Update Worker Count</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AssignWorkers")}>
                <Text style={styles.buttonText}>➡ Assign Workers</Text>
            </TouchableOpacity>
        </View>
    );
}
