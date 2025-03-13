import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ Import useNavigation
import styles from "../styles/ClientDashboard.styles"; // Import styles

export default function ClientDashboard() {
  const navigation = useNavigation(); // ✅ Get navigation object

  // Static Data
  const projectPlan = { details: "This is a sample project plan for construction." };
  const milestones = [
    { id: "1", name: "Foundation", status: "Completed" },
    { id: "2", name: "Framing", status: "In Progress" },
    { id: "3", name: "Roofing", status: "Pending" },
  ];
  const budgetAlerts = [{ message: "Budget exceeds 80% of the planned amount." }];
  const siteImages = [{ id: "1", url: "https://via.placeholder.com/150" }];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Client Dashboard</Text>

      {/* Project Plan Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Project Plan</Text>
        <Text style={styles.text}>{projectPlan.details}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Approve Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Welcome")} // ✅ Navigate to Welcome Screen
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
