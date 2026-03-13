import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Input, Picker } from "./components";

// Options for repeat schedule
const REPEATS = ["none", "daily", "weekly", "biweekly", "monthly"];

// Props interface for type safety
interface Props {
  visible: boolean; // whether the modal is visible
  editing: boolean; // true if editing an existing appointment
  form: {
    // current form data
    provider: string;
    datetime: string;
    repeat: string;
    endsOn: string;
    notes: string;
  };
  error: string; // validation or save error
  onChange: (key: string) => (val: string) => void; // callback for updating form fields
  onSave: () => void; // callback when save button is pressed
  onClose: () => void; // callback when cancel/close is pressed
}

export function AppointmentModal({
  visible,
  editing,
  form,
  error,
  onChange,
  onSave,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* Semi-transparent overlay behind the modal */}
      <View style={s.overlay}>
        {/* Modal box */}
        <View style={s.box}>
          {/* Title changes based on editing or creating */}
          <Text style={s.title}>
            {editing ? "Edit Appointment" : "New Appointment"}
          </Text>

          {/* Form fields inside a scroll view */}
          <ScrollView keyboardShouldPersistTaps="handled">
            {/* Provider input */}
            <Input
              label="Provider"
              value={form.provider}
              onChange={onChange("provider")}
              placeholder="Dr. Smith"
            />

            {/* Date & time input */}
            <Input
              label="Date & Time (YYYY-MM-DDTHH:MM)"
              value={form.datetime}
              onChange={onChange("datetime")}
              placeholder="2026-04-10T14:00"
              autoCapitalize="none"
            />

            {/* Repeat schedule picker */}
            <Picker
              label="Repeat"
              options={REPEATS}
              value={form.repeat}
              onChange={onChange("repeat")}
            />

            {/* Ends On field only shows if repeat is not "none" */}
            {form.repeat !== "none" && (
              <Input
                label="Ends On (YYYY-MM-DD)"
                value={form.endsOn}
                onChange={onChange("endsOn")}
                placeholder="2026-12-31"
                autoCapitalize="none"
              />
            )}

            {/* Optional notes field */}
            <Input
              label="Notes (optional)"
              value={form.notes}
              onChange={onChange("notes")}
              placeholder="e.g. Follow-up visit"
            />

            {/* Show error message if present */}
            {error ? <Text style={s.error}>{error}</Text> : null}
          </ScrollView>

          {/* Action buttons: Cancel and Save */}
          <View style={s.btns}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.saveBtn} onPress={onSave}>
              <Text style={s.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Styles for the modal
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // dark transparent overlay
    justifyContent: "flex-end", // modal slides up from bottom
  },
  box: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    maxHeight: "85%", // prevent modal from filling the whole screen
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 16 },
  error: { color: "red", fontSize: 13, marginTop: 4 },
  btns: { flexDirection: "row", gap: 10, marginTop: 16 }, // horizontal buttons
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
    flex: 2, // make save button larger
    backgroundColor: "#1a73e8",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  saveText: { fontSize: 14, color: "#fff", fontWeight: "700" },
});
