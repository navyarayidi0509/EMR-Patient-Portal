import { createContext, ReactNode, useContext, useState } from "react";

import { setToken } from "../services/api";

// Define the shape of our auth context
interface AuthContextType {
  patient: any | null; // currently signed-in patient
  signIn: (patient: any, token: string) => void; // login function
  signOut: () => void; // logout function
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  patient: null,
  signIn: () => {}, // default does nothing
  signOut: () => {}, // default does nothing
});

// Provider component wraps the app and provides auth state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<any | null>(null); // store current patient

  // Sign in the user and store API token
  const signIn = (p: any, t: string) => {
    setPatient(p); // save patient data
    setToken(t); // save token in API layer
  };

  // Sign out the user and clear API token
  const signOut = () => {
    setPatient(null); // remove patient data
    setToken(null); // remove token from API layer
  };

  return (
    // Provide auth state and functions to the component tree
    <AuthContext.Provider value={{ patient, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming the auth context easily
export const useAuth = () => useContext(AuthContext);
