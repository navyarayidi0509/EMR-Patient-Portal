import jwt from "jsonwebtoken";

// Middleware that checks if the request has a valid JWT token
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization; // read Authorization header from the request

  // If there is no header or it doesn't start with "Bearer ", reject the request
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "No token" });

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);

    // Store the decoded patient id on the request object for later use
    req.patientId = decoded.id;

    // Continue to the next middleware or route handler
    next();
  } catch {
    // If the token is invalid or expired, return an unauthorized response
    res.status(401).json({ error: "Invalid token" });
  }
}