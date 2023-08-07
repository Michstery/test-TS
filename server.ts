import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app: Express = express();
dotenv.config();

// --------- Mongoose Setup --------- //
const defaultConfig = process.env.MONGO_URI as string;
const port = process.env.PORT as string;

mongoose.connect(defaultConfig, {}).catch((err) => console.log(err));
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("connected", () => {
  app.listen(port, () => {
    console.log(`app is running at port ${port}......`);
  });
  console.log("Database connection established");
});

db.on("error", (error: TypeError) => {
  console.log(
    "An error has occurred preventing the database connection from being established",
    JSON.stringify(error)
  );
  console.log(error.message);
});
// ///------------------------------------------------------------------------------------------/// //
