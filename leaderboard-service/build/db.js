"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("postgres"));
const DATABASE_URL = process.env.DATABASE_URL;
const sql = (0, postgres_1.default)(DATABASE_URL || "");
exports.default = sql;
