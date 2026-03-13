import { Stack } from "expo-router";

export default function PortalLayout() {
  return (
    <Stack>
      {/* Main dashboard / landing page of the portal */}
      <Stack.Screen name="index" options={{ title: "My Health Portal" }} />

      {/* Screen showing all the patient's appointments */}
      <Stack.Screen
        name="appointments"
        options={{ title: "My Appointments" }}
      />

      {/* Screen showing all the patient's medications */}
      <Stack.Screen name="medications" options={{ title: "My Medications" }} />
    </Stack>
  );
}
