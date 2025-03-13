import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import styles from "../styles/EngineerDashboard.styles"; // Import styles

export default function EngineerDashboard() {
  // Static Data
  const tasks = [
    { id: "1", name: "Check Foundation", status: "Completed" },
    { id: "2", name: "Inspect Electrical Work", status: "In Progress" },
    { id: "3", name: "Verify Plumbing", status: "Pending" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Engineer Dashboard</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.name} - {item.status}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Mark as Completed</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
