const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./db/db");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const ticketRoute = require("./routes/ticket.route");
const requirementRoute = require("./routes/requirement.route");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

// app.use("/",(req,res)=>{
//     res.send("Welcome to the API");
// })

app.use("/users", userRoute);

app.use("/tickets", ticketRoute);
app.use("/requirements", requirementRoute);

module.exports = app;
