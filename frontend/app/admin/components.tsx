import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Field Input Component
// A reusable text input field with label
export function Input({
  label, // label text shown above input
  value, // current value of input
  onChange, // callback when text changes
  placeholder, // placeholder text when empty
  keyboardType, // type of keyboard (e.g., numeric, email)
  secureTextEntry, // if true, hides text for passwords
  autoCapitalize, // capitalization behavior (none, sentences, words)
}: any) {
  return (
    <View style={s.fieldWrap}>
      {/* Label above the input */}
      <Text style={s.fieldLabel}>{label}</Text>

      {/* Actual text input */}
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? ""}
        placeholderTextColor="#aaa"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize ?? "sentences"} // default capitalization
      />
    </View>
  );
}

// Chip Picker Component
// A custom picker using "chips" for selection
export function Picker({
  label, // label above the picker
  options, // array of selectable options
  value, // currently selected value
  onChange, // callback when user selects a chip
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={s.fieldWrap}>
      {/* Label above chip row */}
      <Text style={s.fieldLabel}>{label}</Text>

      {/* Row of chips */}
      <View style={s.pickerRow}>
        {options.map((o) => (
          <TouchableOpacity
            key={o}
            style={[s.chip, value === o && s.chipActive]} // highlight if selected
            onPress={() => onChange(o)}
          >
            <Text style={[s.chipText, value === o && s.chipTextActive]}>
              {o}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Styles for Input & Picker
const s = StyleSheet.create({
  fieldWrap: { marginBottom: 12 }, // spacing between fields
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4, // space between label and input
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#111",
  },
  pickerRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 }, // horizontal chips with wrap
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipActive: { backgroundColor: "#1a73e8", borderColor: "#1a73e8" }, // highlight selected chip
  chipText: { fontSize: 12, color: "#333" },
  chipTextActive: { color: "#fff" }, // text color for active chip
});
