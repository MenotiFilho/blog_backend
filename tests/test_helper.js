/* eslint-disable no-underscore-dangle */
const Blog = require('../models/blog');

const initialPosts = [
  {
    title: 'First Post',
    author: 'John Doe',
    url: 'https://example.com/first-post',
    likes: 10,
  },
  {
    title: 'Second Post',
    author: 'Jane Smith',
    url: 'https://example.com/second-post',
    likes: 5,
  },
  {
    title: 'Third Post',
    author: 'Bob Johnson',
    url: 'https://example.com/third-post',
    likes: 8,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temporary Post',
    author: 'Temporary Author',
    url: 'https://example.com/temporary-post',
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialPosts,
  nonExistingId,
  blogsInDb,
};
