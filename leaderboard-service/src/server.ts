// .env needs to be first
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getLeaderboard, addLeaderboardEntry } from "./queries";

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("MR MEN MEMORY LEADERBOARD SERVICE");
});

app.get("/leaderboard", getLeaderboard);
app.post("/leaderboard", addLeaderboardEntry);

app.listen({ port: port || "8080", host: "0.0.0.0" }, () => {
  console.log(`[server]: Server running and listen on port ${port}`);
});
