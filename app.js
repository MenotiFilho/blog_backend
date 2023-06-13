const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose').default;

const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

const app = express();

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
