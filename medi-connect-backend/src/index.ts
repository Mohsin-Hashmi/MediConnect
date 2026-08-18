import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route.js";
import { doctorRouter } from "./routes/doctor.route.js";
import { profileRouter } from "./routes/profile.route.js";
import { connectToDatabase } from "./config/db-connection.js";

const PORT = process.env.PORT || 7000;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", profileRouter);
app.use("/api/doctors", doctorRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, World How are you? I am fine");
});

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "App is running fine " });
});
console.log("App is running fine");
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
