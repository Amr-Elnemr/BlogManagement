import mongoose from "mongoose";
import { mongoURI } from "./config";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => {
    console.error("Error conntecting to MongoDB: " + err);
    process.exit(1);
  });
