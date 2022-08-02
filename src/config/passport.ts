import { access } from "fs";
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";
import User from "../../models/user";

const GoogleStrategy = passportGoogle.Strategy;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/google/redirect",
        },
        (accessToken, refreshToken, profile, done) => {
            // get and save profile details
            User.findOrCreate({googleId: profile.id}, function(err,user){
                return done(err, user)
            })
        }
    )
);

