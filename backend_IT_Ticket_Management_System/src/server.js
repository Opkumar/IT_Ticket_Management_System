// server.js
require("dotenv").config();

const connectDB = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user.route");
const ticketRoute = require("./routes/ticket.route");
const requirementRoute = require("./routes/requirement.route");

const { app, server } = require("./config/socket"); // ✅ Use this app/server

const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

connectDB();

app.use(
  cors({
    origin: "https://it-ticket-management-system-om-app.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/requirements", requirementRoute);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

