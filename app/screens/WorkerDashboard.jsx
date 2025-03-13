import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import styles from "../styles/WorkerDashboard.styles"; // Import styles

export default function WorkerDashboard() {
  // Static Data
  const tasks = [
    { id: "1", name: "Mix Concrete", status: "Pending" },
    { id: "2", name: "Install Windows", status: "In Progress" },
    { id: "3", name: "Paint Walls", status: "Completed" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Dashboard</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.name} - {item.status}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.completed]}>
              <Text style={styles.buttonText}>Complete Task</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
