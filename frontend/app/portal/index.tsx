import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { getAppointments, getPrescriptions } from "../../services/api";

// Helpers

// Format a date like "Apr 1, 2026"
const fmt = (d: any) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

// Format a time like "10:30 AM"
const fmtTime = (d: any) =>
  d
    ? new Date(d).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

// Check if a date is within the next 7 days
function within7Days(date: any) {
  const d = new Date(date);
  const now = new Date();
  const plus7 = new Date();
  plus7.setDate(plus7.getDate() + 7);
  return d >= now && d <= plus7;
}

// Component
export default function PortalDashboard() {
  const router = useRouter();
  const { patient, signOut } = useAuth();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // show spinner while loading data
  const [ready, setReady] = useState(false); // ensure auth state is ready

  // Mark as ready after first render
  useEffect(() => {
    setReady(true);
  }, []);

  // Redirect to login if patient not found
  useEffect(() => {
    if (ready && !patient) router.replace("/");
  }, [ready, patient]);

  // Load upcoming appointments & prescriptions
  const load = useCallback(async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const [appts, rxs] = await Promise.all([
        getAppointments(patient._id, true, 3), // fetch next 3 months for reference
        getPrescriptions(patient._id),
      ]);
      setAppointments(appts);
      setPrescriptions(rxs);
    } finally {
      setLoading(false);
    }
  }, [patient]);

  // Fetch data on mount and when patient changes
  useEffect(() => {
    load();
  }, [load]);

  // Return nothing if no patient (avoid flicker before redirect)
  if (!patient) return null;

  // Filter only items happening in the next 7 days
  const upcomingAppts = appointments.filter((a) =>
    within7Days(a.occurrenceDate ?? a.datetime),
  );
  const upcomingRefills = prescriptions.filter((rx) =>
    within7Days(rx.refillOn),
  );

  return (
    <ScrollView style={s.page} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header with patient name and sign out button  */}
      <View style={s.header}>
        <Text style={s.headerName}>
          {patient.firstName} {patient.lastName}
        </Text>
        <TouchableOpacity
          onPress={() => {
            signOut(); // clear auth
            router.replace("/"); // redirect to login
          }}
        >
          <Text style={s.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Loading spinner */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} />
      ) : (
        <View style={s.content}>
          {/* Patient basic info */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Your Information</Text>
            <Row
              label="Name"
              value={`${patient.firstName} ${patient.lastName}`}
            />
            <Row label="Email" value={patient.email} />
            <Row label="Phone" value={patient.phone || "-"} />
            <Row label="DOB" value={fmt(patient.dob)} />
          </View>

          {/* Appointments this week */}
          <View style={s.section}>
            <View style={s.sectionHead}>
              <Text style={s.sectionTitle}>
                Appointments This Week ({upcomingAppts.length})
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/portal/appointments")}
              >
                <Text style={s.link}>View all →</Text>
              </TouchableOpacity>
            </View>
            {upcomingAppts.length === 0 ? (
              <Text style={s.empty}>No appointments in the next 7 days.</Text>
            ) : (
              upcomingAppts.map((a, i) => (
                <View key={`${a._id}-${i}`} style={s.item}>
                  <Text style={s.itemMain}>{a.provider}</Text>
                  <Text style={s.itemSub}>
                    {fmt(a.occurrenceDate)} at {fmtTime(a.occurrenceDate)} ·{" "}
                    {a.repeat}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Refills this week */}
          <View style={s.section}>
            <View style={s.sectionHead}>
              <Text style={s.sectionTitle}>
                Refills This Week ({upcomingRefills.length})
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/portal/medications")}
              >
                <Text style={s.link}>View all →</Text>
              </TouchableOpacity>
            </View>
            {upcomingRefills.length === 0 ? (
              <Text style={s.empty}>No refills due in the next 7 days.</Text>
            ) : (
              upcomingRefills.map((rx) => (
                <View key={rx._id} style={s.item}>
                  <Text style={s.itemMain}>
                    {rx.medication} {rx.dosage}
                  </Text>
                  <Text style={s.itemSub}>
                    Qty {rx.quantity} · Refill due {fmt(rx.refillOn)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Row component for displaying key/value pairs
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

// Styles
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerName: { fontSize: 18, fontWeight: "700", color: "#111" },
  signOut: { fontSize: 14, color: "#1a73e8" },
  content: { padding: 16 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  link: { fontSize: 13, color: "#1a73e8" },
  empty: { fontSize: 13, color: "#999" },
  item: { paddingVertical: 8, borderTopWidth: 1, borderColor: "#eee" },
  itemMain: { fontSize: 14, fontWeight: "600", color: "#111" },
  itemSub: { fontSize: 12, color: "#666", marginTop: 2 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  rowLabel: { fontSize: 13, color: "#666" },
  rowValue: { fontSize: 13, color: "#111", fontWeight: "500" },
});
