import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/WorkerDashboard.styles";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function WorkerDashboard() {
  const [workerId, setWorkerId] = useState(null);
  const [workerName, setWorkerName] = useState(null);
  const [workerStatus, setWorkerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();

  useEffect(() => {
    fetchWorkerDetails();
  }, []);

  // **Fetch Worker Profile Details**
  const fetchWorkerDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
  
      console.log("📌 Debug: Retrieved userId from AsyncStorage:", id); // ✅ Debug Log
  
      if (!id) {
        throw new Error("Worker ID not found in AsyncStorage.");
      }
  
      setWorkerId(id);
  
      // **Fetch Worker Profile**
      const response = await fetch(`${API_BASE_URL}/api/worker-profile?worker_id=${id}`);
      const data = await response.json();
  
      console.log("📌 Worker Profile API Response:", data); // ✅ Debug Log
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch worker details");
      }
  
      setWorkerName(data.name);
      setWorkerStatus(data.status);
  
      await AsyncStorage.setItem("workerName", data.name);
      await AsyncStorage.setItem("workerStatus", data.status);
    } catch (error) {
      console.error("❌ Worker Profile Fetch Error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  

  // **Update Worker Availability**
  const updateAvailability = async (status) => {
    if (!workerId) {
      Alert.alert("Error", "Worker ID is missing.");
      return;
    }

    try {
      console.log(`🔄 Updating Worker ID: ${workerId} to Status: ${status}`);

      const response = await fetch(`${API_BASE_URL}/api/update-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worker_id: workerId, status }),
      });

      const result = await response.json();
      console.log("✅ API Response:", result); // ✅ Debug Log

      if (!response.ok) {
        throw new Error(result.error);
      }

      // ✅ Update UI only if successful
      setWorkerStatus(result.worker.status);
      await AsyncStorage.setItem("workerStatus", result.worker.status);

      Alert.alert("Success", `Status updated to ${result.worker.status}`);
    } catch (error) {
      console.error("❌ Error updating status:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Worker Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View>
          <Text style={styles.profileText}>👷 Name: {workerName || "Loading..."}</Text>
          <Text style={styles.statusText}>📌 Current Status: {workerStatus || "Not Set"}</Text>

          <TouchableOpacity
            style={[styles.statusButton, styles.available]}
            onPress={() => updateAvailability("Available")}
          >
            <Text style={styles.buttonText}>Mark as Available</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, styles.busy]}
            onPress={() => updateAvailability("Busy")}
          >
            <Text style={styles.buttonText}>Mark as Busy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.taskButton}
            onPress={() => navigation.navigate("AvailableTasks")}
          >
            <Text style={styles.buttonText}>View Available Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.taskButton}
            onPress={() => navigation.navigate("TaskStatusUpdate")}
          >
            <Text style={styles.buttonText}>Update Task Status</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
