import { Stack } from "expo-router";

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    // Provide authentication context to all screens
    <AuthProvider>
      {/* Stack navigator for the main app screens */}
      <Stack>
        {/* Landing page / login screen */}
        <Stack.Screen name="index" options={{ title: "Patient Portal" }} />

        {/* Admin dashboard / protected admin screens */}
        <Stack.Screen name="admin" options={{ headerShown: false }} />

        {/* Patient portal (dashboard, appointments, medications, etc.) */}
        <Stack.Screen name="portal" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
