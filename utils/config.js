require('dotenv').config();

const PORT = process.env.PORT || 3003;
const { MONGODB_URI } = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
};
