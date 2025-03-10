// src/config/socket.js
const { Server } = require("socket.io");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = require("../app");

function createServer() {
  let server;

  if (process.env.NODE_ENV === "production") {
    try {
      const privateKey = fs.readFileSync('/path/to/ssl/key.pem', 'utf8');
      const certificate = fs.readFileSync('/path/to/ssl/cert.pem', 'utf8');
      const ca = fs.readFileSync('/path/to/ssl/chain.pem', 'utf8');

      const credentials = { key: privateKey, cert: certificate, ca: ca };
      server = https.createServer(credentials, app);
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
