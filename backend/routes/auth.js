import express from "express";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";

const router = express.Router();

// Login route for patients
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Ensure both fields are provided
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    // Look up the patient by email (convert to lowercase for consistency)
    const patient = await Patient.findOne({ email: email.toLowerCase() });

    // If no patient is found, return invalid credentials
    if (!patient)
      return res.status(401).json({ error: "Invalid email or password" });

    // Compare the entered password with the hashed password in the database
    const match = await patient.comparePassword(password);

    // If passwords don't match, return invalid credentials
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    // Generate a JWT token that expires in 7 days
    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send the token and basic patient information back to the client
    res.json({
      token,
      patient: {
        _id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        dob: patient.dob,
      },
    });
  } catch (err) {
    // Handle unexpected server errors
    res.status(500).json({ error: err.message });
  }
});

export default router;