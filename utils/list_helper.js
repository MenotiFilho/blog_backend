/* eslint-disable max-len */
// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require('lodash');
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const favorite = blogs.find((blog) => blog.likes === maxLikes);

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const blogCounts = _.countBy(blogs, 'author');
  const authorWithMostBlogs = _.maxBy(_.keys(blogCounts), (author) => blogCounts[author]);

  return {
    author: authorWithMostBlogs,
    blogs: blogCounts[authorWithMostBlogs],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorLikes = {};

  blogs.forEach((blog) => {
    if (authorLikes[blog.author]) {
      authorLikes[blog.author] += blog.likes;
    } else {
      authorLikes[blog.author] = blog.likes;
    }
  });

  const authors = Object.keys(authorLikes);
  const mostLikedAuthor = authors.reduce((prevAuthor, currentAuthor) => (authorLikes[currentAuthor] > authorLikes[prevAuthor] ? currentAuthor : prevAuthor));

  return {
    author: mostLikedAuthor,
    likes: authorLikes[mostLikedAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
