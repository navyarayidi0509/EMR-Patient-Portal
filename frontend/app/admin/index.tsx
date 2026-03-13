import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getAppointments,
  getPatients,
  getPrescriptions,
} from "../../services/api";

// Helper function to format a date nicely or show a dash if missing
const fmt = (d: any) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

export default function AdminIndex() {
  const router = useRouter(); // router to navigate between pages

  // State
  const [patients, setPatients] = useState<any[]>([]); // list of patients
  const [counts, setCounts] = useState<
    Record<string, { appts: number; rxs: number }>
  >({}); // store appointment & prescription counts per patient
  const [search, setSearch] = useState(""); // search input value
  const [loading, setLoading] = useState(true); // loading indicator

  // Load patients and counts whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getPatients()
        .then(async (list) => {
          setPatients(list);

          // Fetch appointment + prescription counts for each patient
          const entries = await Promise.all(
            list.map(async (p: any) => {
              const [appts, rxs] = await Promise.all([
                getAppointments(p._id).catch(() => []), // safely fallback if request fails
                getPrescriptions(p._id).catch(() => []),
              ]);
              return [p._id, { appts: appts.length, rxs: rxs.length }];
            }),
          );
          setCounts(Object.fromEntries(entries));
        })
        .finally(() => setLoading(false)); // hide loading indicator once done
    }, []),
  );

  // Filter patients based on search input
  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.firstName?.toLowerCase().includes(q) ||
      p.lastName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.includes(q)
    );
  });

  return (
    <View style={s.page}>
      {/* Toolbar: search + add new patient */}
      <View style={s.toolbar}>
        <TextInput
          style={s.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, email or phone..."
          clearButtonMode="while-editing" // iOS only clear button
        />
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push("/admin/new-patient")}
        >
          <Text style={s.addBtnText}>+ New Patient</Text>
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <ScrollView>
          {/* Table header */}
          <View style={s.thead}>
            <Text style={[s.th, s.cName]}>Patient</Text>
            <Text style={[s.th, s.cDob]}>DOB</Text>
            <Text style={[s.th, s.cContact]}>Contact</Text>
            <Text style={[s.th, s.cCount]}>Appts</Text>
            <Text style={[s.th, s.cCount]}>Rxs</Text>
          </View>

          {/* Empty state if no patients match */}
          {filtered.length === 0 && (
            <Text style={s.empty}>
              {search ? "No patients match your search." : "No patients yet."}
            </Text>
          )}

          {/* List all filtered patients */}
          {filtered.map((p) => {
            const c = counts[p._id]; // counts for this patient
            return (
              <TouchableOpacity
                key={p._id}
                style={s.row}
                onPress={() => router.push(`/admin/${p._id}`)} // navigate to patient detail
              >
                {/* Patient name */}
                <View style={s.cName}>
                  <Text style={s.name}>
                    {p.firstName} {p.lastName}
                  </Text>
                </View>

                {/* Date of birth */}
                <Text style={[s.td, s.cDob]}>{fmt(p.dob)}</Text>

                {/* Contact info */}
                <View style={s.cContact}>
                  <Text style={s.td}>{p.email || "-"}</Text>
                  <Text style={s.tdSub}>{p.phone || "no phone"}</Text>
                </View>

                {/* Appointment & prescription counts */}
                <Text style={[s.td, s.cCount, s.badge]}>
                  {c ? c.appts : "-"}
                </Text>
                <Text style={[s.td, s.cCount, s.badge]}>{c ? c.rxs : "-"}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

// Styles for AdminIndex page
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },

  // Toolbar at top: search + add button
  toolbar: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: "#1a73e8",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  empty: { padding: 20, color: "#999", textAlign: "center" },

  // Table header
  thead: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  th: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
  },

  // Table rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  td: { fontSize: 13, color: "#444" },
  tdSub: { fontSize: 11, color: "#999", marginTop: 2 },
  name: { fontSize: 14, fontWeight: "600", color: "#111" },
  badge: { textAlign: "center", fontWeight: "600", color: "#1a73e8" },

  // Column widths
  cName: { flex: 3 },
  cDob: { flex: 2 },
  cContact: { flex: 3 },
  cCount: { flex: 1 },
});
