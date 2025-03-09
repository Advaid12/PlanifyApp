// screens/DashboardScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Planify Dashboard</Text>

      {/* Project Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Project Status</Title>
          <Paragraph>Ongoing Construction: 75% completed</Paragraph>
        </Card.Content>
      </Card>

      {/* Tasks Progress */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Tasks Overview</Title>
          <Paragraph>Completed: 10 | In Progress: 5 | Pending: 2</Paragraph>
        </Card.Content>
      </Card>

      {/* Budget Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Budget Summary</Title>
          <Paragraph>Total Budget: $500,000</Paragraph>
          <Paragraph>Used: $350,000 | Remaining: $150,000</Paragraph>
        </Card.Content>
      </Card>

      {/* Upcoming Deadlines */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Upcoming Deadlines</Title>
          <Paragraph>Procurement Approval - March 10</Paragraph>
          <Paragraph>Final Inspection - April 5</Paragraph>
        </Card.Content>
      </Card>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => navigation.navigate('Tasks')}>
          View Tasks
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Budget')}>
          Budget Details
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Reports')}>
          Project Reports
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#F5F5F5' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  card: { marginBottom: 15 },
  buttonContainer: { marginTop: 10, gap: 10 },
});
