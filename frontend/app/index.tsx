import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { login } from "../services/api";

export default function LoginPage() {
  const router = useRouter(); // navigation helper
  const { signIn } = useAuth(); // auth context to update login state

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle login button press
  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call API to login
      const data = await login(email.trim(), password);

      // Update auth context and navigate to portal
      signIn(data.patient, data.token);
      router.replace("/portal");
    } catch (e: any) {
      setError(e.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.page}>
      <View style={s.box}>
        {/* App title */}
        <Text style={s.title}>Patient Portal</Text>
        <Text style={s.sub}>Sign in to view your health records</Text>

        {/* Email input */}
        <Text style={s.label}>Email</Text>
        <TextInput
          style={s.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Password input */}
        <Text style={s.label}>Password</Text>
        <TextInput
          style={s.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        {/* Display error message if login fails */}
        {error ? <Text style={s.error}>{error}</Text> : null}

        {/* Login button */}
        <TouchableOpacity
          style={s.btn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Demo credentials hint */}
        <Text style={s.hint}>
          Demo: mark@some-email-provider.net / Password123!
        </Text>

        {/* Link to admin EMR */}
        <TouchableOpacity onPress={() => router.push("/admin")}>
          <Text style={s.link}>Go to Admin EMR →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const s = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4, color: "#111" },
  sub: { fontSize: 14, color: "#666", marginBottom: 24 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginBottom: 14,
    color: "#111",
  },
  error: { color: "red", fontSize: 13, marginBottom: 10 },
  btn: {
    backgroundColor: "#1a73e8",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  hint: { fontSize: 12, color: "#999", textAlign: "center", marginBottom: 16 },
  link: { fontSize: 13, color: "#1a73e8", textAlign: "center" },
});
