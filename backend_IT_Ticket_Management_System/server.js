// server.js
const { server } = require("./src/app"); // Import from `app.js`

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
