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
import { getPrescriptions } from "../../services/api";

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

// Compute upcoming refill dates for a prescription over the next 3 months
function getUpcomingRefills(rx: any): Date[] {
  if (!rx.refillOn || rx.refillSchedule === "as_needed") return []; // no scheduled refill
  const dates: Date[] = [];
  const until = new Date();
  until.setMonth(until.getMonth() + 3); // look 3 months ahead
  const now = new Date();
  let current = new Date(rx.refillOn);

  // Advance the date based on refill schedule
  const advance = () => {
    switch (rx.refillSchedule) {
      case "daily":
        current.setDate(current.getDate() + 1);
        break;
      case "weekly":
        current.setDate(current.getDate() + 7);
        break;
      case "biweekly":
        current.setDate(current.getDate() + 14);
        break;
      case "monthly":
        current.setMonth(current.getMonth() + 1);
        break;
      default:
        return false;
    }
    return true;
  };

  // Skip any past refill dates
  while (current < now) {
    if (!advance()) return dates;
  }

  // Collect upcoming refill dates (up to 12)
  while (current <= until && dates.length < 12) {
    dates.push(new Date(current));
    if (!advance()) break;
  }

  return dates;
}

// Component
export default function PortalMedications() {
  const { patient } = useAuth();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // show spinner while loading
  const [ready, setReady] = useState(false); // wait for auth state

  // Mark component as ready after first render
  useEffect(() => {
    setReady(true);
  }, []);

  // Fetch prescriptions when ready and patient exists
  useEffect(() => {
    if (!ready) return;
    if (!patient) {
      router.replace("/"); // redirect to login if not authenticated
      return;
    }
    getPrescriptions(patient._id)
      .then(setPrescriptions)
      .finally(() => setLoading(false));
  }, [ready, patient]);

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Page header */}
      <Text style={s.pageTitle}>My Medications</Text>
      <Text style={s.pageSub}>All prescriptions and upcoming refill dates</Text>

      {/* Loading state */}
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {/* No prescriptions message */}
      {!loading && prescriptions.length === 0 && (
        <Text style={s.empty}>No prescriptions on file.</Text>
      )}

      {/* List of prescriptions */}
      {prescriptions.map((rx) => {
        const refills = getUpcomingRefills(rx); // calculate future refill dates
        return (
          <View key={rx._id} style={s.card}>
            <Text style={s.medName}>{rx.medication}</Text>
            <Text style={s.medDetail}>
              {rx.dosage} · Qty {rx.quantity} · {rx.refillSchedule}
            </Text>
            <Text style={s.medRefill}>Next refill: {fmt(rx.refillOn)}</Text>
            {rx.notes ? <Text style={s.medNotes}>{rx.notes}</Text> : null}

            {/* Show upcoming refill dates if any */}
            {refills.length > 0 && (
              <View style={s.refillSection}>
                <Text style={s.refillLabel}>
                  Upcoming refills (next 3 months):
                </Text>
                <View style={s.refillDates}>
                  {refills.map((d, i) => (
                    <Text key={i} style={s.refillDate}>
                      {fmt(d)}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      })}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  medName: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 4 },
  medDetail: { fontSize: 13, color: "#444", marginBottom: 2 },
  medRefill: { fontSize: 13, color: "#444", marginBottom: 2 },
  medNotes: { fontSize: 12, color: "#666", marginTop: 4 },
  refillSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  refillLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },
  refillDates: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  refillDate: {
    fontSize: 12,
    backgroundColor: "#eef4ff",
    color: "#1a73e8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
