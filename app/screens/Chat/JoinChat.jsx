// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export default function JoinChatScreen() {
//   const [nickname, setNickname] = useState("");
//   const navigation = useNavigation();

//   const joinChat = () => {
//     if (nickname.trim()) {
//       console.log("Joining with nickname:", nickname);  // Debugging
//       navigation.navigate("Chat", { nickname });
//     } else {
//       alert("Please enter a name");
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 ,backgroundColor:"white"}}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Enter your name</Text>
//       <TextInput
//         placeholder="Your Name"
//         value={nickname}
//         onChangeText={setNickname}
//         style={{
//           width: "100%",
//           borderWidth: 1,
//           padding: 10,
//           marginBottom: 20,
//           borderRadius: 5,
//         }}
//       />
//       <TouchableOpacity onPress={joinChat} style={{ backgroundColor: "blue", padding: 10, borderRadius: 5 }}>
//         <Text style={{ color: "white" }}>Join Chat</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
