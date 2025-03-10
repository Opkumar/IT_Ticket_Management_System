// src/app.js
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const ticketRoute = require("./routes/ticket.route");
const requirementRoute = require("./routes/requirement.route");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

connectDB();

// Improved CORS Configuration
const allowedOrigins = [
  "https://it-ticket-management-system-om-app.vercel.app",
  "http://localhost:5173", // Allow localhost for testing
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/requirements", requirementRoute);

module.exports = app;  // Make sure you're exporting app here
