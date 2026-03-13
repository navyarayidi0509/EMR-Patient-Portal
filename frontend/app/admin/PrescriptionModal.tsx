// This component renders a modal for creating or editing a prescription.
// It includes fields like medication, dosage, quantity, refill date, schedule, and optional notes.
// The parent component owns the state - this modal just displays the form and calls callbacks.

import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Input, Picker } from "./components";

// Predefined refill schedule options for the picker
const REFILL_SCHED = ["daily", "weekly", "biweekly", "monthly", "as_needed"];

interface Props {
  visible: boolean; // Controls modal visibility
  editing: boolean; // Whether we're editing an existing prescription or creating a new one
  form: {
    medication: string;
    dosage: string;
    quantity: string;
    refillOn: string;
    refillSchedule: string;
    notes: string;
  };
  error: string; // Inline error message
  onChange: (key: string) => (val: string) => void; // Called when a field changes
  onSave: () => void; // Called when user taps "Save"
  onClose: () => void; // Called when user taps "Cancel"
}

export function PrescriptionModal({
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
      <View style={s.overlay}>
        <View style={s.box}>
          {/* Modal title changes depending on editing mode */}
          <Text style={s.title}>
            {editing ? "Edit Prescription" : "New Prescription"}
          </Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            {/* Medication name input */}
            <Input
              label="Medication"
              value={form.medication}
              onChange={onChange("medication")}
              placeholder="Metformin"
            />
            {/* Dosage input */}
            <Input
              label="Dosage"
              value={form.dosage}
              onChange={onChange("dosage")}
              placeholder="500mg"
              autoCapitalize="none"
            />
            {/* Quantity input */}
            <Input
              label="Quantity"
              value={form.quantity}
              onChange={onChange("quantity")}
              placeholder="30"
              keyboardType="numeric"
            />
            {/* Refill date input */}
            <Input
              label="Refill Date (YYYY-MM-DD)"
              value={form.refillOn}
              onChange={onChange("refillOn")}
              placeholder="2026-04-01"
              autoCapitalize="none"
            />
            {/* Refill schedule picker */}
            <Picker
              label="Refill Schedule"
              options={REFILL_SCHED}
              value={form.refillSchedule}
              onChange={onChange("refillSchedule")}
            />
            {/* Optional notes field */}
            <Input
              label="Notes (optional)"
              value={form.notes}
              onChange={onChange("notes")}
              placeholder="e.g. Take with food"
            />
            {/* Display an error if present */}
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

// Styles for PrescriptionModal
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent background behind modal
    justifyContent: "flex-end", // modal slides up from bottom
  },
  box: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    maxHeight: "85%", // prevent modal from taking full screen
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 16 },
  error: { color: "red", fontSize: 13, marginTop: 4 }, // inline error message
  btns: { flexDirection: "row", gap: 10, marginTop: 16 },
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
