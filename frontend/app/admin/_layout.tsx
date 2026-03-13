import { Stack } from "expo-router";

// Layout for the Admin section screens
export default function AdminLayout() {
  return (
    <Stack>
      {/* Main page showing the list of all patients */}
      <Stack.Screen name="index" options={{ title: "EMR - All Patients" }} />

      {/* Screen for creating a new patient */}
      <Stack.Screen name="new-patient" options={{ title: "New Patient" }} />

      {/* Dynamic route to view a specific patient's record */}
      <Stack.Screen name="[patientId]" options={{ title: "Patient Record" }} />
    </Stack>
  );
}
