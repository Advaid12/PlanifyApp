import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen.jsx";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ClientDashboard from "../screens/ClientDashboard";
import EngineerDashboard from "../screens/EngineerDashboard";
import WorkerDashboard from "../screens/WorkerDashboard";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>  
      <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ClientDashboard" component={ClientDashboard} />  
      <Stack.Screen name="EngineerDashboard" component={EngineerDashboard} /> 
      <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />  
    </Stack.Navigator>
  );
}