import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";

import {
  createAppointment,
  createPrescription,
  deleteAppointment,
  deletePrescription,
  getAppointments,
  getMedications,
  getPatient,
  getPrescriptions,
  updateAppointment,
  updatePatient,
  updatePrescription,
} from "../../services/api";
import { AppointmentList } from "./AppointmentList";
import { AppointmentModal } from "./AppointmentModal";
import { PatientInfoForm } from "./PatientInfoForm";
import { PrescriptionList } from "./PrescriptionList";
import { PrescriptionModal } from "./PrescriptionModal";

// Default empty appointment object for initializing form
const EMPTY_APPT = {
  provider: "",
  datetime: "",
  repeat: "none",
  endsOn: "",
  notes: "",
};

// Default empty prescription object for initializing form
const EMPTY_RX = {
  medication: "",
  dosage: "",
  quantity: "",
  refillOn: "",
  refillSchedule: "monthly",
  notes: "",
};

export default function PatientRecord() {
  // Get patientId from the URL/query params
  const { patientId: id } = useLocalSearchParams<{ patientId: string }>();
  const router = useRouter();

  // State variables
  // Data state
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  // Patient info form state
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Appointment modal state
  const [apptModal, setApptModal] = useState(false);
  const [editAppt, setEditAppt] = useState<any>(null);
  const [apptForm, setApptForm] = useState(EMPTY_APPT);
  const [apptError, setApptError] = useState("");

  // Prescription modal state
  const [rxModal, setRxModal] = useState(false);
  const [editRx, setEditRx] = useState<any>(null);
  const [rxForm, setRxForm] = useState(EMPTY_RX);
  const [rxError, setRxError] = useState("");

  // Load patient data
  const load = useCallback(async () => {
    if (!id) return; // Skip if no patientId
    setLoading(true);
    setPageError("");
    try {
      // Fetch patient info, appointments, prescriptions, and medications
      const [p, appts, rxs] = await Promise.all([
        getPatient(id),
        getAppointments(id),
        getPrescriptions(id),
        getMedications(),
      ]);
      setPatient(p);
      setInfo({
        firstName: p.firstName,
        lastName: p.lastName,
        dob: p.dob?.slice(0, 10) ?? "", // format date
        email: p.email,
        phone: p.phone ?? "",
      });
      setAppointments(appts);
      setPrescriptions(rxs);
    } catch (e: any) {
      setPageError(e.message ?? "Failed to load."); // handle errors
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Run load on component mount and when patientId changes
  useEffect(() => {
    load();
  }, [load]);

  // Patient info save
  const saveInfo = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await updatePatient(id!, info); // save patient info
      router.back(); // go back to previous screen
    } catch (e: any) {
      setSaveMsg("Error: " + (e.message ?? "Failed to save."));
      setSaving(false);
    }
  };

  // Appointment handlers
  const openNewAppt = () => {
    setEditAppt(null); // no existing appointment, creating new
    setApptForm(EMPTY_APPT); // reset form
    setApptError("");
    setApptModal(true); // open modal
  };

  const openEditAppt = (a: any) => {
    setEditAppt(a); // set appointment being edited
    setApptForm({
      provider: a.provider,
      datetime: a.datetime?.slice(0, 16) ?? "",
      repeat: a.repeat ?? "none",
      endsOn: a.endsOn?.slice(0, 10) ?? "",
      notes: a.notes ?? "",
    });
    setApptError("");
    setApptModal(true); // open modal
  };

  const saveAppt = async () => {
    if (!apptForm.provider.trim() || !apptForm.datetime) {
      setApptError("Provider and date/time are required.");
      return;
    }
    try {
      // Update if editing, else create new appointment
      editAppt
        ? await updateAppointment(editAppt._id, apptForm)
        : await createAppointment({ ...apptForm, patientId: id });
      setApptModal(false);
      load(); // refresh data
    } catch (e: any) {
      setApptError(e.message ?? "Failed to save.");
    }
  };

  const deleteAppt = async (a: any) => {
    if (!window.confirm(`Delete appointment with ${a.provider}?`)) return;
    try {
      await deleteAppointment(a._id);
      load(); // refresh data after deletion
    } catch (e: any) {
      window.alert("Failed to delete: " + e.message);
    }
  };

  // Prescription handlers
  const openNewRx = () => {
    setEditRx(null); // new prescription
    setRxForm(EMPTY_RX); // reset form
    setRxError("");
    setRxModal(true);
  };

  const openEditRx = (rx: any) => {
    setEditRx(rx); // editing existing prescription
    setRxForm({
      medication: rx.medication,
      dosage: rx.dosage,
      quantity: String(rx.quantity),
      refillOn: rx.refillOn?.slice(0, 10) ?? "",
      refillSchedule: rx.refillSchedule,
      notes: rx.notes ?? "",
    });
    setRxError("");
    setRxModal(true);
  };

  const saveRx = async () => {
    if (!rxForm.medication.trim() || !rxForm.dosage.trim()) {
      setRxError("Medication and dosage are required.");
      return;
    }
    try {
      // Update if editing, else create new prescription
      editRx
        ? await updatePrescription(editRx._id, rxForm)
        : await createPrescription({ ...rxForm, patientId: id });
      setRxModal(false);
      load(); // refresh data
    } catch (e: any) {
      setRxError(e.message ?? "Failed to save.");
    }
  };

  const deleteRx = async (rx: any) => {
    if (!window.confirm(`Delete ${rx.medication} ${rx.dosage}?`)) return;
    try {
      await deletePrescription(rx._id);
      load(); // refresh data after deletion
    } catch (e: any) {
      window.alert("Failed to delete: " + e.message);
    }
  };

  // Handle loading & errors
  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (pageError)
    return <Text style={{ padding: 20, color: "red" }}>{pageError}</Text>;
  if (!patient) return <Text style={{ padding: 20 }}>Patient not found.</Text>;

  // Helper setters for forms

  const setI = (k: string) => (v: string) => setInfo((f) => ({ ...f, [k]: v }));
  const setAppt = (k: string) => (v: string) =>
    setApptForm((f) => ({ ...f, [k]: v }));
  const setRx = (k: string) => (v: string) =>
    setRxForm((f) => ({ ...f, [k]: v }));

  // Render main U
  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
    >
      {/* Patient information form */}
      <PatientInfoForm
        info={info}
        saving={saving}
        error={saveMsg}
        onChange={setI}
        onSave={saveInfo}
      />

      {/* List of appointments */}
      <AppointmentList
        appointments={appointments}
        onAdd={openNewAppt}
        onEdit={openEditAppt}
        onDelete={deleteAppt}
      />

      {/* List of prescriptions */}
      <PrescriptionList
        prescriptions={prescriptions}
        onAdd={openNewRx}
        onEdit={openEditRx}
        onDelete={deleteRx}
      />

      {/* Appointment modal */}
      <AppointmentModal
        visible={apptModal}
        editing={!!editAppt}
        form={apptForm}
        error={apptError}
        onChange={setAppt}
        onSave={saveAppt}
        onClose={() => setApptModal(false)}
      />

      {/* Prescription modal */}
      <PrescriptionModal
        visible={rxModal}
        editing={!!editRx}
        form={rxForm}
        error={rxError}
        onChange={setRx}
        onSave={saveRx}
        onClose={() => setRxModal(false)}
      />
    </ScrollView>
  );
}

// Styles
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
});
