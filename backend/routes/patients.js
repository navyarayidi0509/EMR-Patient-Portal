import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// GET all patients (used by admin view)
router.get("/", async (req, res) => {
  try {
    // Fetch all patients but exclude the password field for security
    const patients = await Patient.find().select("-password");
    res.json(patients);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
});

// GET a single patient by ID
router.get("/:id", async (req, res) => {
  try {
    // Find the patient and exclude the password field
    const patient = await Patient.findById(req.params.id).select("-password");

    // If patient doesn't exist, return 404
    if (!patient) return res.status(404).json({ error: "Not found" });

    res.json(patient);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new patient
router.post("/", async (req, res) => {
  try {
    // Create a new patient document using the request body
    const patient = new Patient(req.body);

    // Save to database (password hashing happens in the model)
    await patient.save();

    // Remove password before sending the response
    const { password, ...safe } = patient.toObject();

    res.json(safe);
  } catch (err) {
    // Validation or creation errors
    res.status(400).json({ error: err.message });
  }
});

// UPDATE patient information
router.put("/:id", async (req, res) => {
  try {
    const data = { ...req.body };

    // If password is being updated, we must load the document and save it
    // so the pre-save hook can hash the password
    if (data.password) {
      const patient = await Patient.findById(req.params.id);

      // Update fields on the patient object
      Object.assign(patient, data);

      // Save the document so password hashing runs
      await patient.save();

      // Remove password before returning the response
      const { password, ...safe } = patient.toObject();
      return res.json(safe);
    }

    // If password isn't changing, a simple update is fine
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true } // return the updated document
    ).select("-password");

    res.json(updated);
  } catch (err) {
    // Handle validation or update errors
    res.status(400).json({ error: err.message });
  }
});

export default router;