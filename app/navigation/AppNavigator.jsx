import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native"; 

// Import Screens
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen.jsx";
import ClientDashboard from "../screens/ClientDashboard";
import ClientHome from "../screens/ClientHome";
//import WorkerDashboard from "../screens/WorkerDashboard";
//import AvailableTasks from "../screens/AvailableTasks";
//import TaskStatusUpdate from "../screens/TaskStatusUpdate";
import AssignWorkers from "../screens/Contractor/AssignWorkers.jsx";
import WorkerManagement from "../screens/Contractor/WorkerManagement.jsx";
import ViewMilestone from "../screens/Contractor/ViewMilestone.jsx";
import ContractorDashboard from "../screens/Contractor/ContractorDashboard.jsx";
import BudgetStatusScreen from "../screens/BudgetStatusScreen.jsx";
import BudgetStatusScreen1 from "../screens/BudgetStatusScreen1.jsx";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>  
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>  
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ClientDashboard" component={ClientDashboard} />  
        <Stack.Screen name="ClientHome" component={ClientHome} /> 
        {/* <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
        <Stack.Screen name="AvailableTasks" component={AvailableTasks} />
        <Stack.Screen name="TaskStatusUpdate" component={TaskStatusUpdate} /> */}
        <Stack.Screen name="AssignWorkers" component={AssignWorkers} /> 
        <Stack.Screen name="WorkerManagement" component={WorkerManagement} />
        <Stack.Screen name="ViewMilestone" component={ViewMilestone} />  
        <Stack.Screen name="ContractorDashboard" component={ContractorDashboard}/>
        {/* <Stack.Screen name="Chat" component={Chat}/>
        <Stack.Screen name="JoinChat" component={JoinChat}/>  */}
        <Stack.Screen name="BudgetStatusScreen" component={BudgetStatusScreen}/>
        <Stack.Screen name="BudgetStatusScreen1" component={BudgetStatusScreen1}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
