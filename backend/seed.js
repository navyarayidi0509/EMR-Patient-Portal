import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import Patient from "./models/Patient.js";
import Appointment from "./models/Appointment.js";
import Prescription from "./models/Prescription.js";
import MedicationRef from "./models/MedicationRef.js";

const MEDICATIONS = ["Diovan", "Lexapro", "Metformin", "Ozempic", "Prozac", "Seroquel", "Tegretol"];
const DOSAGES     = ["1mg","2mg","3mg","5mg","10mg","25mg","50mg","100mg","250mg","500mg","1000mg"];

const SAMPLE_PATIENTS = [
  {
    firstName: "Mark", lastName: "Johnson",
    email: "mark@some-email-provider.net", password: "Password123!",
    dob: "1985-04-12", phone: "555-0101",
    appointments: [
      { provider: "Dr Kim West",  datetime: "2026-02-16T16:30:00.000-07:00", repeat: "weekly" },
      { provider: "Dr Lin James", datetime: "2026-02-19T18:30:00.000-07:00", repeat: "monthly" },
    ],
    prescriptions: [
      { medication: "Lexapro",  dosage: "5mg",   quantity: 2, refillOn: "2026-02-05", refillSchedule: "monthly" },
      { medication: "Ozempic",  dosage: "1mg",   quantity: 1, refillOn: "2026-02-10", refillSchedule: "monthly" },
    ],
  },
  {
    firstName: "Lisa", lastName: "Smith",
    email: "lisa@some-email-provider.net", password: "Password123!",
    dob: "1992-09-23", phone: "555-0202",
    appointments: [
      { provider: "Dr Sally Field", datetime: "2026-02-22T18:15:00.000-07:00", repeat: "monthly" },
      { provider: "Dr Lin James",   datetime: "2026-02-25T20:00:00.000-07:00", repeat: "weekly"  },
    ],
    prescriptions: [
      { medication: "Metformin", dosage: "500mg", quantity: 2, refillOn: "2026-02-15", refillSchedule: "monthly" },
      { medication: "Diovan",    dosage: "100mg", quantity: 1, refillOn: "2026-02-25", refillSchedule: "monthly" },
    ],
  },
];

async function seed() {
  await connectDB();

  // Clear existing data
  await Promise.all([
    Patient.deleteMany({}),
    Appointment.deleteMany({}),
    Prescription.deleteMany({}),
    MedicationRef.deleteMany({}),
  ]);
  console.log("🗑  Cleared existing data");

  // Seed medication reference
  await MedicationRef.create({
    name: "__all__",
    dosages: DOSAGES,
  });
  for (const name of MEDICATIONS) {
    await MedicationRef.create({ name, dosages: DOSAGES });
  }
  console.log("💊  Medications seeded");

  // Seed patients
  for (const data of SAMPLE_PATIENTS) {
    const { appointments, prescriptions, ...patientData } = data;

    const patient = await Patient.create(patientData);
    console.log(`👤  Created patient: ${patient.firstName} ${patient.lastName}`);

    for (const appt of appointments) {
      await Appointment.create({ ...appt, patientId: patient._id });
    }

    for (const rx of prescriptions) {
      await Prescription.create({ ...rx, patientId: patient._id });
    }
  }

  console.log("✅  Seed complete!");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });