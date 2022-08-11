const Users = require('../users/users-model');
const Posts = require('../posts/posts-model')

function logger(req, res, next) {
  const date = new Date();
  const timeStamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log('logger:', req.method, req.originalUrl, timeStamp);
  next();
}

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (user == null) {
        next({ status: 404, message: "user not found"});
        return;
      }
      req.exsistingUser = user;
      next();
    })
    //.catch(err => next(err))
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (typeof name !== 'string') {
    next({ status: 400, message: "missing required name field" })
  }else if (name.trim() === '' ) {
    next({ status: 400, message: "missing required name field" })
  } else {
    req.newUser = {...req.body, name: name.trim() }
    next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (typeof text !== 'string') {
    res.status(400).json({ message: "missing required text field" })
  }else if (text.trim() === '' ) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    req.newPost = { ...req.body, text: text.trim() }
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}