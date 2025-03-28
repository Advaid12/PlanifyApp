import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ClientDashboard from "../screens/ClientDashboard";
import EngineerDashboard from "../screens/EngineerDashboard";
import LoginScreen from "../screens/LoginScreen.jsx";
import SignupScreen from "../screens/SignupScreen.jsx";
import WelcomeScreen from "../screens/WelcomeScreen";
import WorkerDashboard from "../screens/WorkerDashboard";
import AvailableTasks from "../screens/AvailableTasks";
import TaskStatusUpdate from "../screens/TaskStatusUpdate";
import SiteEngineer  from "../screens/SiteEngineerDash.jsx";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="site-engineer" screenOptions={{ headerShown: true }}>  
      <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ClientDashboard" component={ClientDashboard} />  
      <Stack.Screen name="site-engineer" component={SiteEngineer} />
      <Stack.Screen name="EngineerDashboard" component={EngineerDashboard} /> 
      <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
      <Stack.Screen name="AvailableTasks" component={AvailableTasks} />
      <Stack.Screen name="TaskStatusUpdate" component={TaskStatusUpdate} />  
    </Stack.Navigator>
  );
}