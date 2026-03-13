import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Helper function to format a date nicely, or show a dash if empty
const fmt = (d: any) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

// Props interface for type safety
interface Props {
  appointments: any[]; // array of appointment objects
  onAdd: () => void; // callback when user taps "Add"
  onEdit: (a: any) => void; // callback when editing an appointment
  onDelete: (a: any) => void; // callback when deleting an appointment
}

export function AppointmentList({
  appointments,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View>
      {/* Header with section title and Add button */}
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>Appointments ({appointments.length})</Text>
        <TouchableOpacity style={s.addBtn} onPress={onAdd}>
          <Text style={s.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Show message if no appointments exist */}
      {appointments.length === 0 && (
        <Text style={s.empty}>No appointments yet.</Text>
      )}

      {/* List all appointments */}
      {appointments.map((a) => (
        <View key={a._id} style={s.card}>
          <View style={{ flex: 1 }}>
            {/* Main info: provider name */}
            <Text style={s.cardMain}>{a.provider}</Text>
            {/* Sub info: date/time and repeat schedule */}
            <Text style={s.cardSub}>
              {fmt(a.datetime)} · repeats {a.repeat}
            </Text>
            {/* Optional notes */}
            {a.notes ? <Text style={s.cardNote}>{a.notes}</Text> : null}
          </View>

          {/* Action buttons for this appointment */}
          <View style={s.actions}>
            <TouchableOpacity onPress={() => onEdit(a)}>
              <Text style={s.editLink}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(a)}>
              <Text style={s.deleteLink}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

// Styles for the component
const s = StyleSheet.create({
  sectionHead: {
    flexDirection: "row", // items in a row
    justifyContent: "space-between", // title on left, button on right
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
    flexDirection: "row", // main info + actions side by side
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
