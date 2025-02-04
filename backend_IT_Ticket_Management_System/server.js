// const https = require('https');
// const app = require('./app');

// const PORT = process.env.PORT || 4000;

// const server = https.createServer(app);
 
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// }
// );
const http = require('http');
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
