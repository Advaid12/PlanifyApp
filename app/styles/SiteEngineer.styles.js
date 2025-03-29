import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#444",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  addProjectButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addProjectButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  milestoneCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 5,
  },
  milestoneDetail: {
    fontSize: 14,
    marginBottom: 3,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  noMilestoneText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  editSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});

export default styles;
