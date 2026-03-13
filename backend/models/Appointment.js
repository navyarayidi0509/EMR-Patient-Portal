import mongoose from "mongoose";

// Define the schema for an appointment document
const AppointmentSchema = new mongoose.Schema(
  {
    // Reference to the patient this appointment belongs to
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // links to the Patient collection
      required: true,
    },

    // Name of the provider or doctor for the appointment
    provider: { type: String, required: true },

    // Date and time of the appointment
    datetime: { type: Date, required: true },

    // Indicates if the appointment repeats and how often
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "biweekly", "monthly"], // allowed values
      default: "none", // default means it does not repeat
    },

    // Optional end date for recurring appointments
    // If null, the appointment repeats indefinitely
    endsOn: { type: Date, default: null },

    // Optional notes related to the appointment
    notes: { type: String },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

// Export the model so it can be used to create, read, update, and delete appointments
export default mongoose.model("Appointment", AppointmentSchema);