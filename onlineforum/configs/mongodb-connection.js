const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config("../.env");

const uri = process.env.DATABASE_URI;

module.exports = function (callback) {
  return MongoClient.connect(uri, callback);
};
