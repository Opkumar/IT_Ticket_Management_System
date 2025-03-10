// server.js
const { createServer } = require("./src/config/socket");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

const server = createServer();

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = server;
