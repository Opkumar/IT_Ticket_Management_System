const https = require('https');
const app = require('./app');

const PORT = process.env.PORT || 4000;

const server = https.createServer(app);
 
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);
