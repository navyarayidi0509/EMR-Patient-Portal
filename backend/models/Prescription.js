import mongoose from "mongoose";

// Define the schema for a prescription
const PrescriptionSchema = new mongoose.Schema(
  {
    // Reference to the patient this prescription belongs to
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Name of the medication
    medication: { type: String, required: true },

    // Dosage information (example: "500mg")
    dosage: { type: String, required: true },

    // Quantity of medication prescribed
    quantity: { type: Number, default: 1 },

    // Date when the next refill is due
    refillOn: { type: Date },

    // How often the prescription should be refilled
    refillSchedule: {
      type: String,
      enum: ["daily", "weekly", "biweekly", "monthly", "as_needed"], // allowed values
      default: "monthly",
    },

    // Optional notes from the provider
    notes: { type: String },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Export the Prescription model so it can be used for database operations
export default mongoose.model("Prescription", PrescriptionSchema);