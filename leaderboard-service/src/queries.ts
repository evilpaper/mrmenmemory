import sql from "./db";
import { Request, Response } from "express";

export const getAllTime = async (request: Request, response: Response) => {
  const allTime = await sql`
    SELECT * FROM times ORDER BY time LIMIT 10;
  `;
  if (allTime) {
    response.status(200).json(allTime);
  } else {
    response
      .status(204)
      .json({ result: "Hmm...couldn't connect to database." });
  }
};

export const getLastWeek = async (request: Request, response: Response) => {
  const lastWeek = await sql`
    SELECT * FROM times WHERE date >= current_date at time zone 'UTC' - interval '7 days' ORDER BY time LIMIT 10;
  `;
  if (lastWeek) {
    response.status(200).json(lastWeek);
  } else {
    response
      .status(204)
      .json({ result: "Hmm...couldn't connect to database." });
  }
};

export const getToday = async (request: Request, response: Response) => {
  const today = await sql`
    SELECT * FROM times WHERE date >= current_date at time zone 'UTC' - interval '7 days' ORDER BY time LIMIT 10;
  `;
  if (today) {
    response.status(200).json(today);
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
