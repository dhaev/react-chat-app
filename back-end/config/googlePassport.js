const GoogleStrategy = require('passport-google-oauth20').Strategy;
const validPassword = require('./passwordUtils').validPassword;
const { User} = require("../models/databaseSchema");

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessTokens, refreshToken, profile, done) =>{
        const  newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            email:  profile.emails[0].value,
            image: profile.photos[0].value   
        }

        try{
            let user = await User.findOne({ email: profile.emails[0].value});

            if(user){
                done(null,user);
            }else{
                user = await User.create(newUser); 
                done(null,user); 
            }

        }catch(err){
   
        }
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}