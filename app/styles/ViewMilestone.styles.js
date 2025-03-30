import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    topButtonsContainer: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    topButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#007bff",
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: "center",
    },
    topButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 60,
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    milestoneCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    milestoneText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    noDataText: {
        textAlign: "center",
        color: "gray",
        marginTop: 10,
    },
    clearButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#ff4444",
        borderRadius: 5,
        alignItems: "center",
    },
    clearButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default styles;