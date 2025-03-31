import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

// Import Screens
import ClientHome from "./screens/ClientHome.jsx";
import ClientDashboard from "./screens/ClientDashboard.jsx";
import EngineerDashboard from "./screens/SiteEngineer/EngineerDashboard.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import SignupScreen from "./screens/SignupScreen.jsx";
import WelcomeScreen from "./screens/WelcomeScreen.jsx";
//import WorkerDashboard from "./screens/WorkerDashboard.jsx";
//import AvailableTasks from "../screens/AvailableTasks";
//import TaskStatusUpdate from "../screens/TaskStatusUpdate";
import AssignWorkers from "../screens/Contractor/AssignWorkers.jsx";
import WorkerManagement from "../screens/Contractor/WorkerManagement.jsx";
import ViewMilestone from "../screens/Contractor/ViewMilestone.jsx";
import ContractorDashboard from "./app/screens/Contractor/ContractorDashboard.jsx";
// import JoinChat from "./app/screens/Chat/JoinChat.jsx";
// import Chat from "./app/screens/Chat/Chat.jsx";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>  
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: true }}>  
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ClientHome" component={ClientHome} />  
        <Stack.Screen name="ClientDashboard" component={ClientDashboard} />  
        <Stack.Screen name="EngineerDashboard" component={EngineerDashboard} /> 
        {/* <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
        <Stack.Screen name="AvailableTasks" component={AvailableTasks} />
        <Stack.Screen name="TaskStatusUpdate" component={TaskStatusUpdate} /> */}
        <Stack.Screen name="AssignWorkers" component={AssignWorkers} /> 
        <Stack.Screen name="WorkerManagement" component={WorkerManagement} />
        <Stack.Screen name="ViewMilestone" component={ViewMilestone} /> 
        <Stack.Screen name="ContractorDashboard" component={ContractorDashboard} />
        {/* <Stack.Screen name="JoinChat" component={JoinChat}/>
        <Stack.Screen name="Chat" component={Chat}/> */}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
