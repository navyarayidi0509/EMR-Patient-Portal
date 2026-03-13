import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Helper function that expands a recurring appointment into individual occurrences
// up to a specified end date
function expandOccurrences(appt, untilDate) {
  const occurrences = [];

  // Starting date of the appointment
  const start = new Date(appt.datetime);

  // Determine the end date for recurrence
  const end = appt.endsOn ? new Date(appt.endsOn) : untilDate;

  // Use whichever comes first: the appointment end date or the requested limit
  const effectiveEnd = end < untilDate ? end : untilDate;

  // If the appointment does not repeat, just return the original date
  if (appt.repeat === "none" || !appt.repeat) {
    if (start <= untilDate)
      occurrences.push({ ...appt.toObject(), occurrenceDate: start });
    return occurrences;
  }

  // Track the current occurrence date
  let current = new Date(start);

  // Functions that advance the current date depending on repeat type
  const STEP = {
    daily: () => current.setDate(current.getDate() + 1),
    weekly: () => current.setDate(current.getDate() + 7),
    biweekly: () => current.setDate(current.getDate() + 14),
    monthly: () => current.setMonth(current.getMonth() + 1),
  };

  const advance = STEP[appt.repeat];

  // If repeat type is invalid, return empty
  if (!advance) return occurrences;

  // Generate occurrences until the effective end date
  while (current <= effectiveEnd) {
    occurrences.push({
      ...appt.toObject(),
      occurrenceDate: new Date(current),
    });

    advance(); // move to the next occurrence

    // Safety limit to prevent infinite loops
    if (occurrences.length > 200) break;
  }

  return occurrences;
}

// GET appointments for a patient
// If ?expand=true&months=3 is provided, return expanded recurring occurrences
router.get("/:patientId", async (req, res) => {
  try {
    // Fetch appointments for the given patient
    const appts = await Appointment.find({ patientId: req.params.patientId });

    // If expand=true, generate occurrences for recurring appointments
    if (req.query.expand === "true") {
      const months = parseInt(req.query.months ?? "3", 10);

      // Calculate the date limit (current date + number of months)
      const until = new Date();
      until.setMonth(until.getMonth() + months);

      // Expand all recurring appointments
      const all = appts.flatMap((a) => expandOccurrences(a, until));

      // Sort occurrences by date
      all.sort(
        (a, b) => new Date(a.occurrenceDate) - new Date(b.occurrenceDate)
      );

      return res.json(all);
    }

    // Otherwise return the raw appointments
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE appointment
router.post("/", async (req, res) => {
  try {
    // Create a new appointment using request body
    const appt = new Appointment(req.body);

    // Save to database
    await appt.save();

    res.json(appt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE appointment
router.put("/:id", async (req, res) => {
  try {
    // Update appointment by ID and return the updated version
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE appointment
router.delete("/:id", async (req, res) => {
  try {
    // Remove appointment from database
    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;