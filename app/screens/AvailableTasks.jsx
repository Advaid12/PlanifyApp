import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  FlatList, 
  SafeAreaView 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/AvailableTasks.styles";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function AvailableTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerId, setWorkerId] = useState(null);

  useEffect(() => {
    fetchWorkerId();
  }, []);

  // **Fetch Worker ID First**
  const fetchWorkerId = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (!id) {
        Alert.alert("Error", "Worker ID not found.");
        return;
      }

      setWorkerId(id);
      console.log("✅ Worker ID Fetched:", id); // ✅ Debug Log

      // **Fetch Tasks Only After Worker ID is Available**
      await fetchTasks();
    } catch (error) {
      console.error("❌ Worker ID Fetch Error:", error.message);
    }
  };

  // **Fetch Available Tasks**
  const fetchTasks = async () => {
    try {
      console.log("🔄 Fetching Available Tasks...");
      const response = await fetch(`${API_BASE_URL}/api/available-tasks`);
      const data = await response.json();

      console.log("📌 API Response:", data); // ✅ Debug Log

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tasks");
      }

      setTasks(data.tasks);
    } catch (error) {
      console.error("❌ Fetch Error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // **Accept or Reject Task**
  const handleTaskAction = async (taskId, action) => {
    if (!workerId) {
      Alert.alert("Error", "Worker ID is missing.");
      return;
    }

    try {
      console.log(`🔄 Sending Task ${action} Request for Task ID: ${taskId}...`);
      
      const response = await fetch(`${API_BASE_URL}/api/task-action`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worker_id: workerId, task_id: taskId, action }),
      });

      const result = await response.json();
      console.log("✅ Task Action Response:", result); // ✅ Debug Log

      if (!response.ok) {
        throw new Error(result.error);
      }

      Alert.alert("Success", `Task ${action}ed successfully`);
      fetchTasks(); // Refresh tasks list after action
    } catch (error) {
      console.error("❌ Task Action Error:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Available Tasks</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No available tasks</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskText}>Task: {item.task_name}</Text>
              <Text style={styles.taskText}>Milestone: {item.milestone}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.taskButton, styles.accept]}
                  onPress={() => handleTaskAction(item.id, "accept")}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.taskButton, styles.reject]}
                  onPress={() => handleTaskAction(item.id, "reject")}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
