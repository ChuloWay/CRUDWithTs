import { access } from "fs";
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";
import User from "../../models/user";

const GoogleStrategy = passportGoogle.Strategy;

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(async (user: any, done) => done(null, user._id))
passport.deserializeUser(async (_id, done) => done(null, await User.findOne({_id})))

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/google/redirect",
        },
        async(accessToken, refreshToken, profile, done) => {
            // search for user
            const user = await User.findOne({ googleId: profile.id});
            // get and save profile 
            // if user doesnt exist 
            if(!user){
                const newUser = await User.create({
                    googleId: profile.id,
                    user: profile.displayName,
                    email: profile.emails?.[0].value,
                        // we are using optional chaining because profile.emails may be undefined.
                });
                if (newUser) {
                    done(null, newUser);
                }
            } else {
                done(null, user);
            }
        }
    )
);

