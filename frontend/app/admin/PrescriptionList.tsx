// This component displays a list of a patient's prescriptions.
// It also allows adding, editing, or deleting prescriptions via callbacks.

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Format dates nicely (e.g., "Apr 10, 2026"), or show "-" if no date
const fmt = (d: any) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

interface Props {
  prescriptions: any[]; // list of prescriptions to display
  onAdd: () => void; // callback when user taps "Add"
  onEdit: (rx: any) => void; // callback when user taps "Edit" on a prescription
  onDelete: (rx: any) => void; // callback when user taps "Delete"
}

export function PrescriptionList({
  prescriptions,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View>
      {/* Section header with prescription count and add button */}
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>
          Prescriptions ({prescriptions.length})
        </Text>
        <TouchableOpacity style={s.addBtn} onPress={onAdd}>
          <Text style={s.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Show message if no prescriptions exist yet */}
      {prescriptions.length === 0 && (
        <Text style={s.empty}>No prescriptions yet.</Text>
      )}

      {/* List each prescription as a card */}
      {prescriptions.map((rx) => (
        <View key={rx._id} style={s.card}>
          <View style={{ flex: 1 }}>
            {/* Main prescription info */}
            <Text style={s.cardMain}>
              {rx.medication} · {rx.dosage}
            </Text>
            {/* Secondary info: quantity, refill schedule, next refill */}
            <Text style={s.cardSub}>
              Qty {rx.quantity} · {rx.refillSchedule} · Next refill:{" "}
              {fmt(rx.refillOn)}
            </Text>
            {/* Optional notes */}
            {rx.notes ? <Text style={s.cardNote}>{rx.notes}</Text> : null}
          </View>

          {/* Actions: edit or delete */}
          <View style={s.actions}>
            <TouchableOpacity onPress={() => onEdit(rx)}>
              <Text style={s.editLink}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(rx)}>
              <Text style={s.deleteLink}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

// Styles for PrescriptionList
const s = StyleSheet.create({
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  addBtn: {
    backgroundColor: "#1a73e8",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  empty: { color: "#999", fontSize: 13, marginBottom: 8 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  cardMain: { fontSize: 14, fontWeight: "600", color: "#111" },
  cardSub: { fontSize: 12, color: "#666", marginTop: 2 },
  cardNote: { fontSize: 12, color: "#999", marginTop: 4 },
  actions: { gap: 8, alignItems: "flex-end", marginLeft: 10 },
  editLink: { fontSize: 13, color: "#1a73e8" },
  deleteLink: { fontSize: 13, color: "#cc0000" },
});
