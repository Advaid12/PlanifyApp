// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // Change to your server's IP

// const ChatScreen = ({ route }) => {
//   const nickname = route.params?.nickname || "Guest"; // Prevent undefined errors
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     console.log("📡 Connecting to chat as:", nickname);

//     // ✅ Fetch previous messages when user joins
//     socket.emit("getChatHistory");

//     socket.on("chatHistory", (history) => {
//       console.log("📜 Received Chat History:", history);
//       setMessages(history);
//     });

//     socket.on("receiveMessage", (newMessage) => {
//       console.log("📩 New Message:", newMessage);
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     return () => {
//       socket.off("chatHistory");
//       socket.off("receiveMessage");
//     };
//   }, []);

//   // ✅ Send message to server
//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit("sendMessage", { nickname, message });
//       setMessage(""); // Clear input field
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//         renderItem={({ item }) => (
//           <View style={styles.messageContainer}>
//             <Text style={styles.messageText}>
//               <Text style={styles.nickname}>{item.nickname}: </Text>
//               {item.message}
//             </Text>
//           </View>
//         )}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type a message..."
//           style={styles.input}
//         />
//         <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// // ✅ Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     padding: 10,
//   },
//   messageContainer: {
//     backgroundColor: "#f0f0f0",
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   messageText: {
//     color: "#333",
//   },
//   nickname: {
//     fontWeight: "bold",
//     color: "blue",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderTopWidth: 1,
//     padding: 10,
//     backgroundColor: "white",
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: "white",
//   },
//   sendButton: {
//     backgroundColor: "blue",
//     padding: 10,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   sendButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export default ChatScreen;
