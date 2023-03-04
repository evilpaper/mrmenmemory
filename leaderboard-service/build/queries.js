"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLeaderboardEntry = exports.getLeaderboard = void 0;
const db_1 = __importDefault(require("./db"));
const getLeaderboard = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const leaders = yield (0, db_1.default) `
    SELECT * FROM times ORDER BY time LIMIT 10;
  `;
    if (leaders) {
        response.status(200).json(leaders);
    }
    else {
        response
            .status(204)
            .json({ result: "Hmm...couldn't connect to database." });
    }
});
exports.getLeaderboard = getLeaderboard;
const addLeaderboardEntry = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, time, date } = request.body;
    const entry = yield (0, db_1.default) `INSERT INTO times (name, time, date) VALUES (${name}, ${time}, ${date}) RETURNING *`;
    if (entry) {
        response.status(201).json({
            result: `The following leaderboard entry has been added: ${JSON.stringify(entry[0])}`,
        });
    }
    else {
        response.status(204).json({
            result: "Hmm...couldn't connect to database. Weird, never happend before :).",
        });
    }
});
exports.addLeaderboardEntry = addLeaderboardEntry;
