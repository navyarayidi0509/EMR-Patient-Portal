import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Input } from "./components";

interface Props {
  info: {
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    phone: string;
  };
  saving: boolean; // true while the save request is in progress
  error: string; // displays an error message if save fails
  onChange: (key: string) => (val: string) => void; // callback to update individual fields
  onSave: () => void; // called when user taps "Save Changes"
}

export function PatientInfoForm({
  info,
  saving,
  error,
  onChange,
  onSave,
}: Props) {
  return (
    <View>
      {/* Section header */}
      <Text style={s.sectionTitle}>Patient Information</Text>

      {/* First and last name fields sit side by side */}
      <View style={s.twoCol}>
        <View style={{ flex: 1 }}>
          <Input
            label="First Name"
            value={info.firstName}
            onChange={onChange("firstName")}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Last Name"
            value={info.lastName}
            onChange={onChange("lastName")}
          />
        </View>
      </View>

      {/* Other basic info fields */}
      <Input
        label="Date of Birth (YYYY-MM-DD)"
        value={info.dob}
        onChange={onChange("dob")}
        placeholder="2000-09-05"
        autoCapitalize="none"
      />
      <Input
        label="Email"
        value={info.email}
        onChange={onChange("email")}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        label="Phone"
        value={info.phone}
        onChange={onChange("phone")}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      {/* Show an inline error if save fails */}
      {error ? <Text style={s.error}>{error}</Text> : null}

      {/* Save button; shows spinner while saving */}
      <TouchableOpacity style={s.saveBtn} onPress={onSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.saveBtnText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Styles
const s = StyleSheet.create({
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 24,
    marginBottom: 10,
  },
  twoCol: { flexDirection: "row", gap: 12 }, // row layout for first/last name
  error: { color: "red", fontSize: 13, marginTop: 4 }, // inline error message
  saveBtn: {
    backgroundColor: "#1a73e8",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
