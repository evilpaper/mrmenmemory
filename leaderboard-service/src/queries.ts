import sql from "./db";
import { Request, Response } from "express";

export const getLeaderboard = async (request: Request, response: Response) => {
  const leaders = await sql`
    SELECT * FROM times ORDER BY time LIMIT 10;
  `;
  if (leaders) {
    response.status(200).json(leaders);
  } else {
    response
      .status(204)
      .json({ result: "Hmm...couldn't connect to database." });
  }
};

export const addLeaderboardEntry = async (
  request: Request,
  response: Response
) => {
  const { name, time, date } = request.body;

  const entry =
    await sql`INSERT INTO times (name, time, date) VALUES (${name}, ${time}, ${date}) RETURNING *`;

  if (entry) {
    response.status(201).json({
      result: `The following leaderboard entry has been added: ${JSON.stringify(
        entry[0]
      )}`,
    });
  } else {
    response.status(204).json({
      result:
        "Hmm...couldn't connect to database. Weird, never happend before :).",
    });
  }
};
