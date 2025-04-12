// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db"); // ✅ importing db connection
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ connect to MongoDB
connectDB();

// ✅ use routes
app.use("/api/todos", todoRoutes);

// ✅ start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
