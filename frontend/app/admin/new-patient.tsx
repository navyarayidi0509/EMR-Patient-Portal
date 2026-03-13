import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createPatient } from "../../services/api";

export default function NewPatient() {
  const router = useRouter(); // Router for navigation
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    password: "",
  }); // Form state for new patient
  const [saving, setSaving] = useState(false); // Track submission/loading state
  const [error, setError] = useState(""); // Validation or API errors

  // Helper to update a single field in the form
  const set = (key: string) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Submit form to create new patient
  const submit = async () => {
    setError(""); // reset previous errors

    // Basic validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true); // show loading
    try {
      await createPatient(form); // call API
      router.back(); // go back to previous page on success
    } catch (e: any) {
      setError(e.message ?? "Failed to create patient.");
      setSaving(false); // hide loading on error
    }
  };

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Section: Patient basic info */}
      <Text style={s.sectionTitle}>Patient Information</Text>

      {/* First & Last Name side by side */}
      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Label text="First Name *" />
          <Input
            value={form.firstName}
            onChange={set("firstName")}
            placeholder="Mark"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Label text="Last Name *" />
          <Input
            value={form.lastName}
            onChange={set("lastName")}
            placeholder="Johnson"
          />
        </View>
      </View>

      {/* DOB field */}
      <Label text="Date of Birth (YYYY-MM-DD)" />
      <Input
        value={form.dob}
        onChange={set("dob")}
        placeholder="1985-04-12"
        autoCapitalize="none"
      />

      {/* Email field */}
      <Label text="Email *" />
      <Input
        value={form.email}
        onChange={set("email")}
        placeholder="mark@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Phone field */}
      <Label text="Phone" />
      <Input
        value={form.phone}
        onChange={set("phone")}
        placeholder="555-0100"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      {/* Section: Portal access */}
      <Text style={s.sectionTitle}>Portal Access</Text>
      <Text style={s.hint}>
        Patient uses this password to log into the Patient Portal.
      </Text>

      {/* Password field */}
      <Label text="Password *" />
      <Input
        value={form.password}
        onChange={set("password")}
        placeholder="Min 6 characters"
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Show error message if any */}
      {error ? <Text style={s.error}>{error}</Text> : null}

      {/* Action buttons */}
      <View style={s.buttons}>
        <TouchableOpacity style={s.cancelBtn} onPress={() => router.back()}>
          <Text style={s.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.saveBtn} onPress={submit} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" /> // show loading spinner while saving
          ) : (
            <Text style={s.saveText}>Create Patient</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Reusable label component
function Label({ text }: { text: string }) {
  return <Text style={s.label}>{text}</Text>;
}

// Reusable input component
function Input({
  value,
  onChange,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
}: any) {
  return (
    <TextInput
      style={s.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize ?? "words"}
      secureTextEntry={secureTextEntry}
    />
  );
}

// Styles
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
  },
  hint: { fontSize: 12, color: "#666", marginBottom: 10 },
  row: { flexDirection: "row", gap: 12 }, // row for side-by-side fields
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#111",
    marginBottom: 4,
  },
  error: { color: "red", fontSize: 13, marginTop: 10 },
  buttons: { flexDirection: "row", gap: 10, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 14, color: "#333" },
  saveBtn: {
    flex: 2,
    backgroundColor: "#1a73e8",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  saveText: { fontSize: 14, color: "#fff", fontWeight: "700" },
});
