const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local');
const keys = require('./keys');
const User = require("../models/user");
var express = require("express");
var app = express();

// app.use(require("express-session")({
//     secret : "my name is you",
//     resave : true,
//     saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
console.log("SHUBHAMMMMMM");
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

function chooseLocalStrategy(req,res,next){
    console.log("\n\n\n\nSHUBHAM\n\n\n\n");
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    console.log("\n\n\n\nLOCAL DONEn\n\n\n");
    return next();
}
function chooseGoogleStrategy(req,res,next){
    console.log("\n\n\n\nSHUBHAM\n\n\n\n");
    passport.use(new GoogleStrategy({
        callbackURL:'/auth/google/redirect',
        clientID: process.env.GclientID,
        clientSecret: process.env.GclientSecret
    },(accessToken,refreshToken,profile,done)=>{
    
        console.log("passport callback");
        console.log(profile);
        req.user=profile;
        User.findOne({googleid:profile.id},(err,user)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(profile);
                if(user==null){
                    console.log("NO USER");
                    new User({name:profile.displayName,logintype:2,username:profile.emails[0].value,password:null,googleid:profile.id,facebookid:null,hash:null,salt:null}).save();
                    console.log("ADDED NEW USER");
                }
                else{
                    console.log("USER EXISTS");
                    console.log(user);
                }
            }
        });
        return done(null, profile);
    
    })
    );
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    return next();
}
function chooseFacebookStrategy(req,res,next){
    passport.use(new FacebookStrategy({
        clientID: process.env.FclientID,
        clientSecret: process.env.FclientSecret,
        callbackURL: "https://xyz0.herokuapp.com/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, cb) {
          console.log("FFFBBB");
          console.log(profile);
          User.findOne({facebookid:profile.id},(err,user)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(profile);
                if(user==null){
                    console.log("NO USER");
                    new User({name:profile.displayName,logintype:3,username:null,password:null,googleid:null,facebookid:profile.id,hash:null,salt:null}).save();
                    console.log("ADDED NEW USER");
                }
                else{
                    console.log("USER EXISTS");
                    console.log(user);
                }
            }
        });
        console.log('ENDDD');
        return cb(null, profile);
      }
    ));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    return next();
}

module.exports = {
    chooseGoogleStrategy,
    chooseLocalStrategy,
    chooseFacebookStrategy

};