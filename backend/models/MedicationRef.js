import mongoose from "mongoose";

// Schema that stores reference information for medications
// This acts like a master list of medications and their available dosages
const MedicationRefSchema = new mongoose.Schema({
  // Name of the medication (must be unique so duplicates aren't created)
  name: { type: String, required: true, unique: true },

  // List of possible dosage options for this medication
  // Example: ["250mg", "500mg", "1000mg"]
  dosages: [{ type: String }],
});

// Export the model so it can be used in the app to query medication references
export default mongoose.model("MedicationRef", MedicationRefSchema);