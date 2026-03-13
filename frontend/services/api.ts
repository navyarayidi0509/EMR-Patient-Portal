const BASE = "http://localhost:3000/api"; // base URL for API

let token: string | null = null; // store the current auth token

// Set the global token for authenticated requests
export const setToken = (t: string | null) => {
  token = t;
};

// Generic request helper to handle headers, token, and JSON response
async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json", // all requests are JSON
  };
  if (token) headers["Authorization"] = `Bearer ${token}`; // attach token if available

  const res = await fetch(`${BASE}${path}`, { ...options, headers }); // perform fetch
  const data = await res.json(); // parse JSON
  if (!res.ok) throw new Error(data.error ?? "Request failed"); // handle errors
  return data;
}

// Auth
export const login = (email: string, password: string) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Patients
export const getPatients = () => request("/patients"); // fetch all patients
export const getPatient = (id: string) => request(`/patients/${id}`); // fetch a single patient
export const createPatient = (data: any) =>
  request("/patients", { method: "POST", body: JSON.stringify(data) }); // create a new patient
export const updatePatient = (id: string, data: any) =>
  request(`/patients/${id}`, { method: "PUT", body: JSON.stringify(data) }); // update patient data

// Appointments
export const getAppointments = (
  patientId: string,
  expand = false,
  months = 3,
) => request(`/appointments/${patientId}?expand=${expand}&months=${months}`); // get appointments for patient
export const createAppointment = (data: any) =>
  request("/appointments", { method: "POST", body: JSON.stringify(data) }); // create a new appointment
export const updateAppointment = (id: string, data: any) =>
  request(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(data) }); // update appointment
export const deleteAppointment = (id: string) =>
  request(`/appointments/${id}`, { method: "DELETE" }); // delete appointment

// Prescriptions
export const getPrescriptions = (patientId: string) =>
  request(`/prescriptions/${patientId}`); // fetch prescriptions for a patient
export const createPrescription = (data: any) =>
  request("/prescriptions", { method: "POST", body: JSON.stringify(data) }); // create a new prescription
export const updatePrescription = (id: string, data: any) =>
  request(`/prescriptions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }); // update prescription
export const deletePrescription = (id: string) =>
  request(`/prescriptions/${id}`, { method: "DELETE" }); // delete prescription

// Medications reference
export const getMedications = () => request("/medications"); // fetch list of medications
