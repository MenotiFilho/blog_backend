/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialPosts.map((post) => new Blog(post));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('returns the correct number of blog posts in JSON format', async () => {
  const response = await api.get('/api/blogs');

  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toContain('application/json');

  expect(response.body).toHaveLength(helper.initialPosts.length);
});

test('blog post identifier property is named "id"', async () => {
  const response = await api.get('/api/blogs');
  const posts = response.body;

  posts.forEach((post) => {
    expect(post.id).toBeDefined();
    expect(post._id).toBeUndefined();
  });
});

test('a new blog post is created', async () => {
  const newBlog = {
    title: 'Test Blog Post',
    author: 'John Doe',
    url: 'https://testblogpost.com',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;

  expect(blogs).toHaveLength(helper.initialPosts.length + 1);

  const titles = blogs.map((blog) => blog.title);
  expect(titles).toContain(newBlog.title);
});

test('sets default value 0 for missing likes property', async () => {
  const newBlog = {
    title: 'Test Blog Post 0 likes',
    author: 'John Doe',
    url: 'https://testblogpost.com',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const createdBlog = response.body.find((blog) => blog.title === newBlog.title);

  expect(createdBlog).toBeDefined();
  expect(createdBlog.likes || 0).toBe(0);
});

test('returns 400 Bad Request if title is missing', async () => {
  const newBlog = {
    author: 'John Doe',
    url: 'https://testblogpost.com',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('returns 400 Bad Request if url is missing', async () => {
  const newBlog = {
    title: 'Test Blog Post',
    author: 'John Doe',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('deletes a blog post', async () => {
  const initialBlogs = await helper.blogsInDb();
  const blogToDelete = initialBlogs[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const updatedBlogs = await helper.blogsInDb();
  expect(updatedBlogs).toHaveLength(initialBlogs.length - 1);
});

test('updates the number of likes for a blog post', async () => {
  const initialBlogs = await helper.blogsInDb();
  const blogToUpdate = initialBlogs[0];
  const updatedLikes = blogToUpdate.likes + 1;

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: updatedLikes })
    .expect(200);

  expect(response.body.likes).toBe(updatedLikes);

  const updatedBlogs = await helper.blogsInDb();
  const updatedBlog = updatedBlogs.find((blog) => blog.id === blogToUpdate.id);
  expect(updatedBlog.likes).toBe(updatedLikes);
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
