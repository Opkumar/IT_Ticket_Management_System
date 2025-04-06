require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");  // Keep this one
const userRoute = require("./routes/user.route");
const ticketRoute = require("./routes/ticket.route");
const requirementRoute = require("./routes/requirement.route");
const cookieParser = require("cookie-parser");



const app = express();

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

connectDB();

// Allowed Origins List


app.use(
  cors({
    // origin: "https://it-ticket-management-system-om-app.vercel.app", // YOUR frontend URL
    origin: "http://localhost:5173", // YOUR frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/requirements", requirementRoute);

module.exports = app;
