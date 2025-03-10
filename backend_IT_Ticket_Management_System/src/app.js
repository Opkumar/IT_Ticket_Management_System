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

app.use(
  cors({
    origin: "https://it-ticket-management-system-om-app.vercel.app", // Allow frontend URLs
    credentials: true, // Allow cookies to be sent
  })
);


app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/requirements", requirementRoute);

module.exports = app;  // Make sure you're exporting app here
