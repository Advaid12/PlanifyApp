import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const BudgetStatusScreen = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        const response = await axios.get(`http://localhost:5000/api/site-engineer-projects/${email}`);
        setStatuses(response.data);
      } catch (err) {
        console.error("Error fetching budget statuses:", err);
        setErrorMsg("no current projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (errorMsg) return <Text style={styles.error}>{errorMsg}</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Top left buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={() => navigation.navigate("SiteEngineerDashboard")} style={styles.navButton}>
          <Text style={styles.navButtonText}>➕ Add Project</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SiteEngineerDash")} style={styles.navButton}>
          <Text style={styles.navButtonText}>📌 View Milestones</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("EngineerDashboard")} style={styles.navButton}>
          <Text style={styles.navButtonText}>Manage Project</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>📊 Your Project Budget Statuses</Text>
      {statuses.map((status, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.label}>Project ID: {status.project_id}</Text>
          <Text style={styles.label}>Total Budget: {status.project_budget}</Text>
          <Text style={styles.label}>Milestone Budget: {status.total_milestone_budget}</Text>
          <Text style={[styles.label, { color: status.overrun ? "red" : "green" }]}>
            {status.message}
          </Text>
          {status.overrun && (
            <Text style={styles.alert}>🚨 Overrun Amount: ${status.overrun_amount}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 20,
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  navButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  alert: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginTop: 10,
  },
  error: {
    marginTop: 50,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default BudgetStatusScreen;
