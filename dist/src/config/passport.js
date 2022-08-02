"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const secrets_1 = require("../utils/secrets");
const user_1 = __importDefault(require("../../models/user"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.serializeUser(user_1.default.serializeUser());
passport_1.default.deserializeUser(user_1.default.deserializeUser());
passport_1.default.use(new GoogleStrategy({
    clientID: secrets_1.GOOGLE_CLIENT_ID,
    clientSecret: secrets_1.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/redirect",
}, (accessToken, refreshToken, profile, done) => {
    // get and save profile details
    user_1.default.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
    });
}));
