import dotenv from "dotenv";
import fs from "fs";

// check if .env is available
if(fs.existsSync(".env")) {
    dotenv.config({ path: ".env"})
} else {
    console.error(".env file is not present.")
}

// environment check
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT == "production";

export const PORT = (process.env.PORT || 5000 ) as number;

// google auth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;