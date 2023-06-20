/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});
blogsRouter.post('/', async (request, response, next) => {
  const { body } = request;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Missing title or author' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndDelete(request.params.id);
    if (result) {
      response.status(204).end(); // Retorna 204 No Content em caso de sucesso
    } else {
      response.status(404).end(); // Retorna 404 Not Found se o post não for encontrado
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true },
    );

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).end(); // Retorna 404 Not Found se o post não for encontrado
    }
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
