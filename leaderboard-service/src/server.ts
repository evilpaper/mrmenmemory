// .env needs to be first
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import { getLeaderboard, addLeaderboardEntry } from "./queries";

const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("MR MEN MEMORY LEADERBOARD SERVICE");
});

app.get("/leaderboard", getLeaderboard);
app.post("/leaderboard", addLeaderboardEntry);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
