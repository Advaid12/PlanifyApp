import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "green",
    marginTop: 10,
  },
  remainingText: {
    marginTop: 8,
    fontSize: 16,
    color: "green",
    fontWeight: "600",
  },

  // ✅ NEWLY ADDED STYLES (without modifying existing ones)

  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 10,
    textAlign: "center",
    color: "#444",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#CCC",
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  smallText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  errorText: {
    color: "#D00",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
});