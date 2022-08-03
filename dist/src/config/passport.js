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
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport_1.default.serializeUser(async (user, done) => done(null, user._id));
passport_1.default.deserializeUser(async (_id, done) => done(null, await user_1.default.findOne({ _id })));
passport_1.default.use(new GoogleStrategy({
    clientID: secrets_1.GOOGLE_CLIENT_ID,
    clientSecret: secrets_1.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/redirect",
}, async (accessToken, refreshToken, profile, done) => {
    // search for user
    const user = await user_1.default.findOne({ googleId: profile.id });
    // get and save profile 
    // if user doesnt exist 
    if (!user) {
        const newUser = await user_1.default.create({
            googleId: profile.id,
            user: profile.displayName,
            email: profile.emails?.[0].value,
            // we are using optional chaining because profile.emails may be undefined.
        });
        if (newUser) {
            done(null, newUser);
        }
    }
    else {
        done(null, user);
    }
}));
