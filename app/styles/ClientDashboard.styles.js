import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  
  // 🔹 Milestone (Timeline) Styles
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
  },
  timelineCircle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  timelineLine: {
    position: "absolute",
    left: 7,
    width: 2,
    backgroundColor: "#ddd",
    top: 15,
    bottom: -10,
  },
  timelineText: {
    fontSize: 16,
    color: "#333",
  },

  // 🔹 Form Styles
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  // 🔹 Alert & Image Styles
  alertText: {
    color: "red",
    fontWeight: "bold",
  },
  siteImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },

  // 🔹 Button Styles
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
