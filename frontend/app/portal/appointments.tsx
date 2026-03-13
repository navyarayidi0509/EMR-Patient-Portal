import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { getAppointments } from "../../services/api";

//Helper functions for formatting dates and times
const fmt = (d: any) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "-";

const fmtTime = (d: any) =>
  d
    ? new Date(d).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

// Component
export default function PortalAppointments() {
  const { patient } = useAuth(); // Get the current logged-in patient
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]); // list of upcoming appointments
  const [loading, setLoading] = useState(true); // loading indicator
  const [ready, setReady] = useState(false); // ensure patient data is ready before fetching

  // Mark the component as ready after first render
  useEffect(() => {
    setReady(true);
  }, []);

  // Fetch appointments when ready and patient exists
  useEffect(() => {
    if (!ready) return;
    if (!patient) {
      router.replace("/"); // redirect to login if no patient
      return;
    }

    const now = new Date();

    // Fetch next 3 months of appointments
    getAppointments(patient._id, true, 3)
      .then((data) =>
        setAppointments(
          data.filter(
            (a: any) => new Date(a.occurrenceDate ?? a.datetime) >= now,
          ),
        ),
      )
      .finally(() => setLoading(false));
  }, [ready, patient]);

  // Group appointments by month for display
  const grouped: Record<string, any[]> = {};
  appointments.forEach((a) => {
    const key = new Date(a.occurrenceDate ?? a.datetime).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" },
    );
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  });

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Page header */}
      <Text style={s.pageTitle}>All Upcoming Appointments</Text>
      <Text style={s.pageSub}>Next 3 months</Text>

      {/* Loading indicator */}
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {/* Empty state */}
      {!loading && appointments.length === 0 && (
        <Text style={s.empty}>
          No upcoming appointments in the next 3 months.
        </Text>
      )}

      {/* Render grouped appointments */}
      {Object.entries(grouped).map(([month, items]) => (
        <View key={month} style={s.group}>
          <Text style={s.monthLabel}>{month}</Text>
          {items.map((a, i) => (
            <View key={`${a._id}-${i}`} style={s.card}>
              <Text style={s.cardDate}>{fmt(a.occurrenceDate)}</Text>
              <Text style={s.cardTime}>{fmtTime(a.occurrenceDate)}</Text>
              <Text style={s.cardProvider}>{a.provider}</Text>
              <Text style={s.cardRepeat}>Repeats: {a.repeat || "none"}</Text>
              {a.notes ? <Text style={s.cardNotes}>{a.notes}</Text> : null}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

// Styles
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f5f5" },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  pageSub: { fontSize: 13, color: "#666", marginBottom: 20 },
  empty: { fontSize: 14, color: "#999" },
  group: { marginBottom: 20 },
  monthLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a73e8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardDate: { fontSize: 14, fontWeight: "700", color: "#111" },
  cardTime: { fontSize: 13, color: "#444", marginBottom: 4 },
  cardProvider: { fontSize: 14, color: "#333" },
  cardRepeat: { fontSize: 12, color: "#999", marginTop: 4 },
  cardNotes: { fontSize: 12, color: "#666", marginTop: 4 },
});
