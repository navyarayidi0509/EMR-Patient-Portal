import express from "express";
import Prescription from "../models/Prescription.js";

const router = express.Router();

// GET all prescriptions for a specific patient
router.get("/:patientId", async (req, res) => {
  try {
    // Find prescriptions using patientId from URL
    const rxs = await Prescription.find({ patientId: req.params.patientId });
    res.json(rxs);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new prescription
router.post("/", async (req, res) => {
  try {
    // Create a new Prescription document from request body
    const rx = new Prescription(req.body);

    // Save to database
    await rx.save();

    res.json(rx);
  } catch (err) {
    // Handle validation or save errors
    res.status(400).json({ error: err.message });
  }
});

// UPDATE an existing prescription by ID
router.put("/:id", async (req, res) => {
  try {
    // Find prescription by ID and update with request body, return the updated document
    const updated = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    // Handle validation or update errors
    res.status(400).json({ error: err.message });
  }
});

// DELETE a prescription by ID
router.delete("/:id", async (req, res) => {
  try {
    // Remove prescription from database
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
});

export default router;