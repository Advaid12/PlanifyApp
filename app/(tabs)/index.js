import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
//import AvailableTasks from "../screens/AvailableTasks";
import ClientHome from "../screens/ClientHome";
import ClientDashboard from "../screens/ClientDashboard";
import SiteEngineerDashboard from "../screens/SiteEngineer/EngineerDashboard.jsx";
import LoginScreen from "../screens/LoginScreen.jsx";
import SignupScreen from "../screens/SignupScreen.jsx";
import SiteEngineerProjectScreen from "../screens/SiteEngineer/SiteEngineerDash.jsx";
//import TaskStatusUpdate from "../screens/TaskStatusUpdate";
import WelcomeScreen from "../screens/WelcomeScreen";
//import WorkerDashboard from "../screens/WorkerDashboard";
import AssignWorkers from "../screens/Contractor/AssignWorkers.jsx";
import WorkerManagement from "../screens/Contractor/WorkerManagement.jsx";
import ViewMilestone from "../screens/Contractor/ViewMilestone.jsx";
import { View } from "react-native-web";
import ContractorDashboard from "../screens/Contractor/ContractorDashboard.jsx";
import BudgetStatusScreen from "../screens/BudgetStatusScreen.jsx";
import BudgetStatusScreen1 from "../screens/BudgetStatusScreen1.jsx";




const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>  
      <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ClientHome" component={ClientHome} /> 
      <Stack.Screen name="ClientDashboard" component={ClientDashboard} />  
      <Stack.Screen name="EngineerDashboard" component={SiteEngineerDashboard} /> 
      {/* <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />
      <Stack.Screen name="AvailableTasks" component={AvailableTasks} />
      <Stack.Screen name="TaskStatusUpdate" component={TaskStatusUpdate} />   */}
      <Stack.Screen name="site-engineer" component={SiteEngineerProjectScreen} /> 
      <Stack.Screen name="AssignWorkers" component={AssignWorkers} /> 
      <Stack.Screen name="WorkerManagement" component={WorkerManagement} />
      <Stack.Screen name="ViewMilestone" component={ViewMilestone} />
      <Stack.Screen name="ContractorDashboard" component={ContractorDashboard}/>
      <Stack.Screen name="BudgetStatusScreen" component={BudgetStatusScreen}/>
      <Stack.Screen name="BudgetStatusScreen1" component={BudgetStatusScreen1}/>
    </Stack.Navigator>
  );
}