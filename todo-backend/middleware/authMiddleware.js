const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  
  if (!token) {
    return res.status(401).json({ message: "Token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the JWT token
    req.userId = decoded.id; // Attach the user ID from the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" }); // Handle token verification errors
  }
};
