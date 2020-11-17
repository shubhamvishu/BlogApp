const router = require('express').Router();
var express =  require("express"),
    app = express(),
    axios = require('axios');

function isLoggedIn(req,res,next){
    console.log("shubh"+ req.user);
    if(req.isAuthenticated()){
        return next();
    }
    else{
        console.log("NOT LOGGED IN");
        res.redirect("/auth/login");
    }
        
}
router.get("/",isLoggedIn,function(req,res){
    res.redirect("/news/top-headlines");
    //getNewsEndpoint('https://newsapi.org/v2/top-headlines?country=in&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
router.get("/top-headlines",isLoggedIn,function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/top-headlines?country=in&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
router.get("/everything",isLoggedIn,function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/everything?q=world&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
router.get("/search/:query",isLoggedIn,function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/top-headlines?q='+req.params.query+'&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
router.get("/:country",isLoggedIn,function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/top-headlines?country='+req.params.country+'&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});

function getNewsEndpoint(url,req,res){
    axios.get(url)
    .then(function (response) {
        
        //console.log(response.data.articles);
        var obj = {
            data:response.data.articles,
            size:false,
            profile:req.session.passport.user
        }
        if(response.data.articles.length){
            console.log("More than 1");
            obj.size=true;
            res.render("news",{newses:obj});
        }
        else{
            console.log("Zero");
            res.render("news",{newses:obj});
        }
        //res.render("news",{newses:response.data.articles});
    })
    .catch(function (error) {
        console.log(error);
        res.redirect("/news");
    })
    .then(function () {
    });
}
module.exports = router;