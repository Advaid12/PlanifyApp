import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

// Import Screens
import ClientDashboard from "./screens/ClientDashboard.jsx";
import EngineerDashboard from "./screens/EngineerDashboard.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import SignupScreen from "./screens/SignupScreen.jsx";
import WelcomeScreen from "./screens/WelcomeScreen.jsx";
import WorkerDashboard from "./screens/WorkerDashboard.jsx";
import AvailableTasks from "../screens/AvailableTasks";
import TaskStatusUpdate from "../screens/TaskStatusUpdate";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>  
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: true }}>  
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ClientDashboard" component={ClientDashboard} />  
        <Stack.Screen name="EngineerDashboard" component={EngineerDashboard} /> 
        <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
        <Stack.Screen name="AvailableTasks" component={AvailableTasks} />
        <Stack.Screen name="TaskStatusUpdate" component={TaskStatusUpdate} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
