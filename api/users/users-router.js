const express = require('express');

const Users = require('./users-model')
const Posts = require('../posts/posts-model')

const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware')

const router = express.Router();

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
});

router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      res.status(200).json(user)
    })
});

router.post('/', validateUser, (req, res) => {
  Users.insert(req.newUser)
    .then(user => {
      res.status(201).json(user)
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.newUser)
    .then(result => {
      //console.log(result)
      res.status(200).json(result)
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(result => {
      //console.log(req.exsistingUser)
      res.status(200).json(req.exsistingUser)
    })
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const allPosts = await Posts.get();

  const userPosts = allPosts.filter(post => post.user_id === req.exsistingUser.id)

  res.status(200).json(userPosts)
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postInfo = { ...req.body, user_id: req.exsistingUser.id }
  const newPost = await Posts.insert(postInfo);

  res.status(201).json(newPost)

});

// do not forget to export the router
module.exports = router;