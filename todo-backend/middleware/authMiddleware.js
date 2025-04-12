const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    req.userId = decoded.id; 
    next(); 
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
