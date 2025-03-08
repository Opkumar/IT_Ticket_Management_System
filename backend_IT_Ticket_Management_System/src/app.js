// src/app.js
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const ticketRoute = require("./routes/ticket.route");
const requirementRoute = require("./routes/requirement.route");
const cookieParser = require("cookie-parser");
const initializeSocket = require("./config/socket");

dotenv.config();

const app = express(); // Create Express instance

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173","https://it-ticket-management-system-app.vercel.app"],
    credentials: true,
  })
);

app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/requirements", requirementRoute);

// Initialize Socket.io with Express app
const { server } = initializeSocket(app);

module.exports = { app, server };
