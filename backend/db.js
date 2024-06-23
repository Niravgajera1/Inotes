const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://nirav:Nirav1234@cluster0.o3yedn9.mongodb.net/";

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log("mongo connected successfully");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToMongo;
