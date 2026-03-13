import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PatientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    dob:       { type: Date },
    email:     { type: String, required: true, unique: true, lowercase: true },
    phone:     { type: String },
    password:  { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password before saving using async/await without next()
PatientSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

PatientSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("Patient", PatientSchema);
