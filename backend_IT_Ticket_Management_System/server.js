// server.js
// const { server } = require("./src/app"); // Import from `app.js`
const { server } = require("./src/config/socket"); // Import from `config/socket.js`

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
