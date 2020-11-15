const passport = require('passport');
const keys = require('./config/keys');
var express =  require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override"),
    mongoose = require('mongoose'),
    authRoutes = require('./routes/auth-routes'),
    newsRoutes = require('./routes/news-routes'),
    blogRoutes = require('./routes/blogs-routes');

//mongoose.connect("mongodb://localhost/authdemo",{ useNewUrlParser: true,useUnifiedTopology: true} );
mongoose.connect(keys.mongo.URI,{ useNewUrlParser: true,useUnifiedTopology: true} );

mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret : "my name is you",
    resave : true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Main routes
app.use("/auth",authRoutes);
app.use("/news",newsRoutes);
app.use("/blogs",blogRoutes);

//Other Routes
app.get("/home",function(req,res){
    res.redirect("/");
});
app.get("/",function(req,res){
    console.log("USER");
    //console.log(req.session.passport);
    var data = {
        posts:null,
        oneblog:null,
        isloggedin:false,
        profile:null
    };
    if(req.user!=null){
        data.isloggedin=true;
    }
    res.render("home",{data:data});
});
app.get("/error",function(req,res){
    res.send("error");
});
app.get("/*",function(req,res){
    res.send("404 not found");
});
app.listen(process.env.PORT || 5000,function(){
    console.log("EXPRESS APP STARTED");
});