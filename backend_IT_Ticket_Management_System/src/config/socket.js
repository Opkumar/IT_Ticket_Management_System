// src/config/socket.js
const { Server } = require("socket.io");
const https = require("https");
const app = require("../app");

const server = https.createServer(app); // Attach Express app to server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://it-ticket-management-system-om-app.vercel.app",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

module.exports = { server, io };
