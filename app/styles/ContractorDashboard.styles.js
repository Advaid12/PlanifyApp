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
        marginBottom: 15,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    listItemContainer: {
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
    listItem: {
        fontSize: 16,
        fontWeight: "bold",
    },
    picker: {
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default styles;
