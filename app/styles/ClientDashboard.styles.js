import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa", // 🔹 Soft, elegant background
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#34495e",
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
    backgroundColor: "#3498db", // ✅ Updated to match theme
  },
  timelineLine: {
    position: "absolute",
    left: 7,
    width: 2,
    backgroundColor: "#bdc3c7",
    top: 15,
    bottom: -10,
  },
  timelineText: {
    fontSize: 16,
    color: "#2c3e50",
  },

  // 🔹 Form Styles
  input: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  // 🔹 Alert & Image Styles
  alertText: {
    color: "#e74c3c",
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
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
