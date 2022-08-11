const express = require('express');
const { logger } = require('../api/middleware/middleware');
const usersRouter = require('./users/users-router')

const server = express();
// remember express by default cannot parse JSON in request bodies
server.use(express.json());


// global middlewares and the user's router need to be connected here
server.use(logger);
server.use('/api/users', usersRouter)


// server.get('/', (req, res) => {
//   res.send(`<h2>Let's write some middleware!</h2>`);
// });

server.use((err, req, res, next) => {
  console.log(err)
  let { status = 500, message = "Yup, that's an error 500 right there bud. You best go fix it!"} = err;
  res.status(status).json({ message: message });
})

module.exports = server;
