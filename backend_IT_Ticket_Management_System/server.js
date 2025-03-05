// const app = require("./app");
const app = require("./src/app");
const setupSocket = require("./src/config/socket");

const PORT = process.env.PORT || 4000;

// Setup WebSocket with the existing Express app
const { server } = setupSocket(app);

server.listen(PORT, () => {
  console.log(`Server running on : ${PORT}`);
});
