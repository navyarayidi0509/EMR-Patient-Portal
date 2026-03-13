import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Import DB connection
import connectDB from "./config/db.js";

// Import route handlers
import authRoutes         from "./routes/auth.js";
import patientRoutes      from "./routes/patients.js";
import appointmentRoutes  from "./routes/appointments.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import medicationRoutes   from "./routes/medications.js";

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS so frontend can access API
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Mount API routes
app.use("/api/auth",          authRoutes);
app.use("/api/patients",      patientRoutes);
app.use("/api/appointments",  appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medications",   medicationRoutes);

// Test route to check API status
app.get("/", (_, res) => res.json({ status: "EMR API running" }));

// Start server on PORT from env or default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));