// 4.3.1 - Authentication Project
// Mon. Dec. 13, 2021
// Needed to install: npm i express-session connect-session-knex

const server = require('./api/server.js');

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
