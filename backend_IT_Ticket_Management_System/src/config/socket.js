const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://it-ticket-management-system-om-app.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`[${new Date().toISOString()}] A user connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`[${new Date().toISOString()}] A user disconnected: ${socket.id}`);
  });
});

module.exports = { app, server, io };


// // src/config/socket.js
// require("dotenv").config();
// const { Server } = require("socket.io");
// const http = require("http");
// const app = require("../app"); // Import the Express app directly

// function createServer() {
//   const server = http.createServer(app);
//   console.log("Using HTTP server");

//   const io = new Server(server, {
//     cors: {
//       origin: process.env.BASE_URL,
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("A user connected", socket.id);

//     socket.on("disconnect", () => {
//       console.log("A user disconnected", socket.id);
//     });
//   });

//   return server; // Return the server instance
// }

// module.exports = { createServer,io };
