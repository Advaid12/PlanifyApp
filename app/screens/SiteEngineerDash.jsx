import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  StyleSheet 
} from "react-native";

export default function SiteEngineer() {
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);

  // Function to fetch all Project IDs from the database
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects");
      const data = await response.json();

      if (response.ok) {
        setProjectList(data.projects.map(item => item.project_id));
      } else {
        Alert.alert("Error", "Failed to fetch project IDs.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  // Function to fetch milestone details for the selected Project ID
  const fetchMilestones = async (projectId) => {
    console.log("Fetching milestones for:", projectId);
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`);
      const data = await response.json();

      if (response.ok) {
        setMilestones(data.milestones);
      } else {
        Alert.alert("Error", "Failed to fetch milestones.");
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  // Fetch project IDs when the component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Site Engineer</Text>

      {/* Display List of Project IDs */}
      <Text style={styles.subtitle}>Select a Project:</Text>
      {projectList.length === 0 ? (
        <Text style={styles.noProjectsText}>No projects found.</Text>
      ) : (
        <FlatList
          data={projectList}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.projectItem}
              onPress={() => {
                setSelectedProject(item);
                fetchMilestones(item);
              }}
            >
              <Text style={styles.projectText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Display Milestone Details for Selected Project */}
      {selectedProject && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Project ID: {selectedProject}</Text>
          <Text style={styles.detailsTitle}>Milestones:</Text>
          {milestones.length > 0 ? (
            <FlatList
              data={milestones}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.milestoneItem}>
                  <Text style={styles.milestoneTitle}>{item.milestone_name}</Text>
                  <Text>Description: {item.description}</Text>
                  <Text>Budget: ${item.budget}</Text>
                  <Text>Start Date: {item.beginningdate}</Text>
                  <Text>Deadline: {item.deadline}</Text>
                  <Text>Status: {item.status}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.detailsText}>No milestones found.</Text>
          )}
        </View>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  noProjectsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
  projectItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 5,
  },
  projectText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 16,
  },
  milestoneItem: {
    backgroundColor: "#d9edf7",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

