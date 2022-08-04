"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.PORT = exports.ENVIRONMENT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
// check if .env is available
if (fs_1.default.existsSync(".env")) {
    dotenv_1.default.config({ path: ".env" });
}
else {
    console.error(".env file is not present.");
}
// environment check
exports.ENVIRONMENT = process.env.NODE_ENV;
const prod = exports.ENVIRONMENT == "production";
exports.PORT = (process.env.PORT || 5000);
// google auth
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
