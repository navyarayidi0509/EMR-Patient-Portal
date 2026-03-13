import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema for a patient
const PatientSchema = new mongoose.Schema(
  {
    // Patient's first name
    firstName: { type: String, required: true },

    // Patient's last name
    lastName: { type: String, required: true },

    // Date of birth
    dob: { type: Date },

    // Email used for login, must be unique
    email: { type: String, required: true, unique: true, lowercase: true },

    // Optional phone number
    phone: { type: String },

    // Password stored in hashed form
    password: { type: String, required: true },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Before saving the patient, hash the password if it was changed
PatientSchema.pre("save", async function (next) {
  // If password wasn't modified, continue without hashing
  if (!this.isModified("password")) return next();

  // Hash the password with bcrypt
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Helper method to compare a plain password with the stored hashed password
PatientSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Export the Patient model so it can be used in the app
export default mongoose.model("Patient", PatientSchema);