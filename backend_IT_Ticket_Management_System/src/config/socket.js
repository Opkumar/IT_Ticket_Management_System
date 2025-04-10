const { Server } = require("socket.io");
const http = require("http");
const app = require("../app");

let io;

function createServer() {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: "https://it-ticket-management-system-om-app.vercel.app",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  });

  return server;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized. Call createServer() first.");
  }
  return io;
}

module.exports = { createServer, getIO };

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
