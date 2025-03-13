import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native"; 

// Import Screens
import WelcomeScreen from "../screens/WelcomeScreen.jsx";
import LoginScreen from "../screens/LoginScreen.jsx";
import SignupScreen from "../screens/SignupScreen.jsx";
import ClientDashboard from "../screens/ClientDashboard";
import EngineerDashboard from "../screens/EngineerDashboard";
import WorkerDashboard from "../screens/WorkerDashboard.jsx";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>  
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: true }}>  
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />  
        <Stack.Screen name="ClientDashboard" component={ClientDashboard} />  
        <Stack.Screen name="EngineerDashboard" component={EngineerDashboard} /> 
        <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
