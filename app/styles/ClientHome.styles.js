import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: "#34495e",
  },
  input: {
    height: 45,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    height: 50,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    position: "absolute",
    top: 20,
    right: 20, // ✅ Keeps it in the top-right corner
    backgroundColor: "#3498db",
    paddingVertical: 8, // 🔹 Smaller padding
    paddingHorizontal: 16, // 🔹 Reduced width
    borderRadius: 6, // ✅ Slightly rounded corners
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14, // 🔹 Smaller font size
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
