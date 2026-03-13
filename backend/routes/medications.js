import express from "express";
import MedicationRef from "../models/MedicationRef.js";

const router = express.Router();

// Route to fetch available medications and dosage options
router.get("/", async (req, res) => {
  try {
    // Get all medication records except the special "__all__" entry
    const meds = await MedicationRef.find({ name: { $ne: "__all__" } });

    // Fetch the special record that stores all possible dosage values
    const allDosages = await MedicationRef.findOne({ name: "__all__" });

    // Return a clean response with medication names and dosage list
    res.json({
      medications: meds.map((m) => m.name).sort(), // extract medication names and sort them
      dosages: allDosages?.dosages ?? [], // return dosage list or empty array if not found
    });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
});

export default router;