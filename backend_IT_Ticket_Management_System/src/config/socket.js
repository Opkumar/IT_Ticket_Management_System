// src/config/socket.js
const { Server } = require("socket.io");
const https = require("https");
const http = require("http");
const app = require("../app");

function createServer() {
  let server;
  if (process.env.NODE_ENV === "production") {
    try {
      server = https.createServer( app);
      console.log("Using HTTPS server");
    } catch (error) {
      console.error("SSL configuration failed:", error.message);
      server = http.createServer(app);
    }
  } else {
    server = http.createServer(app);
    console.log("Using HTTP server");
  }

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://it-ticket-management-system-om-app.vercel.app"],
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

module.exports = { createServer };
