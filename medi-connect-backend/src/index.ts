import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectToDatabase } from "./config/db-connection.js";

const PORT = process.env.PORT || 7000;
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World How are you?");
});

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process with an error code
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
