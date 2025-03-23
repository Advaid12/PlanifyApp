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
import styles from "../styles/TaskStatusUpdate.styles";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function TaskStatusUpdate() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerId, setWorkerId] = useState(null);

  useEffect(() => {
    fetchWorkerId();
  }, []);

  const fetchWorkerId = async () => {
    const id = await AsyncStorage.getItem("userId");
    if (!id) {
      Alert.alert("Error", "Worker ID not found.");
      return;
    }
    setWorkerId(id);
    fetchAcceptedTasks();
  };

  // **Fetch Accepted Tasks**
  const fetchAcceptedTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/accepted-tasks?worker_id=${workerId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch tasks");

      setTasks(data.tasks);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // **Update Task Status**
  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/update-task-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worker_id: workerId, task_id: taskId, status }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      Alert.alert("Success", `Task updated to ${status}`);
      fetchAcceptedTasks(); // Refresh tasks
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Update Task Status</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No accepted tasks</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskText}>Task: {item.task_name}</Text>
              <Text style={styles.taskText}>Status: {item.status}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.taskButton, styles.inProgress]}
                  onPress={() => updateTaskStatus(item.id, "In Progress")}
                >
                  <Text style={styles.buttonText}>In Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.taskButton, styles.completed]}
                  onPress={() => updateTaskStatus(item.id, "Completed")}
                >
                  <Text style={styles.buttonText}>Mark as Completed</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
