/* eslint-disable consistent-return */
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

blogsRouter.post('/', (request, response, next) => {
  const { title, url } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'Missing title or author' });
  }

  const blog = new Blog(request.body);

  blog.save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
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
