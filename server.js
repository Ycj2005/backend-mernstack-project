import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import cors from "cors";
import express from "express";
import { DBConnection } from "./config/Db.js";
import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173" || "*",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);

app.listen(5500, async () => {
  await DBConnection();
  console.log("your app is listen on port 5500");
});
