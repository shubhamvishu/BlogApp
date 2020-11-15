var express = require("express");
const passport = require('passport');
const router = require('express').Router();
var User = require('../models/user');
var Auth = require('../config/passport-setup');

var app = express();

app.use(require("express-session")({
    secret : "my name is you",
    resave : true,
    saveUninitialized: true
}));

function isLoggedIn(req,res,next){
    console.log(req.user);
    if(req.isAuthenticated()){
        res.redirect("/home");
    }else{
        return next();
    }

}

router.get("/register",isLoggedIn,function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    //res.send("register");
    //req.body.username
    //req.body.password
    User.register(new User({username:req.body.username,name:req.body.name,googleid:null}),req.body.password,function(err, user){
        if(err){
            console.log("\n\n\n\nERROR\n\n\n\n");
            console.log(err);
            res.render("register");
        }
        console.log("\n\n\n\nHERE\n\n\n\n");
        passport.authenticate("local")(req,res,function(){
            console.log("\n\n\n\nSECRET\n\n\n\n");
            res.redirect("/news");
        });
        console.log("\n\n\n\nEND\n\n\n\n");
    });
});

router.get("/login",isLoggedIn,function(req,res){
    res.render("login",{msg:""});
});

router.post("/login",Auth.chooseLocalStrategy, passport.authenticate("local",{
    successRedirect : "/news",
    failureRedirect :"/auth/login"
}),function(req,res){
    res.send("logged in");
});

router.get("/google",Auth.chooseGoogleStrategy, passport.authenticate('google',{
    scope:['profile','email']
}),(req,res)=>{
    res.send("google login here");
});

router.get("/google/redirect",passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
    console.log("\n\n\nREDIRECTED\n\n\n");
    res.redirect('/news');
});

router.get("/logout",(req,res)=>{
    req.user=null;
    req.logOut();
    res.redirect('/home');
});



module.exports = router;