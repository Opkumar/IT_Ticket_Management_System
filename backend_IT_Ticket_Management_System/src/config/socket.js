const { Server } = require("socket.io");
const http = require("http");

function setupSocket(app) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  const userSocketMap = {};

  function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }

  io.on("connection", (socket) => {
    console.log("A user connected ", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected ", socket.id);
      Object.keys(userSocketMap).forEach((key) => {
        if (userSocketMap[key] === socket.id) {
          delete userSocketMap[key];
        }
      });
    //   io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return { server, io, getReceiverSocketId };
}

module.exports = setupSocket;
