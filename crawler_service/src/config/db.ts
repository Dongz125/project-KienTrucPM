import mongoose, { Mongoose } from "mongoose";

class MongoDriver {
  private mongoose: Mongoose;

  constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
  }
}

async function createMongoDriver() {
  console.log("Starting Mongo Driver", process.env.MONGO_URL);
  const driver = await mongoose.connect(process.env.MONGO_URL || "");
  return new MongoDriver(driver);
}

export { MongoDriver, createMongoDriver };
