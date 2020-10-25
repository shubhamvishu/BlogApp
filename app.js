const { default: Axios } = require("axios");
const e = require("express");

var express =  require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    methodOverride = require("method-override"),
    mongoose = require('mongoose'),
    axios = require('axios');

mongoose.connect("mongodb://localhost/blogapp",{ useNewUrlParser: true,useUnifiedTopology: true} );
//mongoose.connect("mongodb+srv://user1:IoNJJMT0O7IC7Y0C@blogapp.9nfl6.mongodb.net/blogapp?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true} );

mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

var blogsSchema = new mongoose.Schema({
    title:String,
    author:String,
    date:String,
    imageLink:String,
    description:String
});

var Blog = mongoose.model("Blog",blogsSchema);

//News

app.get("/news",function(req,res){
    res.redirect("/news/top-headlines");
    //getNewsEndpoint('https://newsapi.org/v2/top-headlines?country=in&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
app.get("/news/top-headlines",function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/top-headlines?country=in&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
app.get("/news/everything",function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/everything?sources=the-times-of-india&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
app.get("/news/search/:query",function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/top-headlines?q='+req.params.query+'&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});
app.get("/news/:country",function(req,res){
    getNewsEndpoint('https://newsapi.org/v2/top-headlines?country='+req.params.country+'&apiKey=5026e5a981424f77910a4e5ef90ccaee',req,res);
});

function getNewsEndpoint(url,req,res){
    axios.get(url)
    .then(function (response) {
        
        //console.log(response.data.articles);
        var obj = {
            data:response.data.articles,
            size:false
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
    // handle error
        console.log(error);
    })
    .then(function () {
    // always executed
    });
}

//Blogs

app.get("/blogs",function(req,res){
    //res.send("SHOW POSTS");

    Blog.find({},function(err,posts){
        var data = {
            posts:posts,
            oneblog:null
        };
        if(err){
            console.log("Error parsing DB");
        }
        else{
            console.log("GET ALL POSTS");
            console.log(posts);
            res.render("blogs",{posts:data});
        }
    });
    //res.render("posts");
});
app.get("/blogs/new",function(req,res){
    res.render("newpost");
});
app.post("/blogs",function(req,res){
    console.log("Adding a new post");
    console.log(req);
    var newBlog = {
        title : req.body.title,
        author : req.body.author,
        date : String(new Date().toLocaleDateString()),
        imageLink : req.body.imagelink,
        description : req.body.desp
    };
    console.log(req.body);
    Blog.create(newBlog,function(err,blogs){
        if(err){
            console.log("Error in creation");
        }
        else{
            console.log("Added");
            //res.send("heyy");
        }
    });
    //console.log(req.body.title);
    //res.redirect("/blogs/posts");
});
app.get("/blogs/:id",function(req,res){
    //res.send("<h1>Hello news</h1>");
    console.log("REQ id:"+ req.params.id);
    var oneBlog = null;
    Blog.findById(req.params.id,function(err,posts){
        if(err){
            console.log(err);
            console.log("Error parsing DB");
        }
        else{
            console.log("My POST");
            console.log(posts);
            oneBlog = posts;

            Blog.find({},function(err,posts){
                console.log("X=");
                console.log(oneBlog);
                var data = {
                    posts:posts,
                    oneblog:oneBlog
                };
                if(err){
                    console.log("Error parsing DB");
                }
                else{
                    console.log("GET 1 BLOG ID");
                    console.log(posts);
                    res.render("blogs",{posts:data});
                }
            });
        }
    });
    //res.send("SHOWWW");

});
app.get("/blogs/:id/edit",function(req,res){
    var oneBlog = null;

    Blog.findById(req.params.id,function(err,posts){
        if(err){
            console.log(err);
            console.log("Error parsing DB");
        }
        else{
            console.log("NEW");
            console.log(posts);
            oneBlog = posts;

            Blog.find({},function(err,posts){
                console.log("X=");
                console.log(oneBlog);
                var data = {
                    posts:posts,
                    oneblog:oneBlog
                };
                if(err){
                    console.log("Error parsing DB");
                }
                else{
                    console.log("\n\n\n\nEDIT PAGE\n\n\n");
                    console.log(posts);
                    res.render("editpost",{posts:data});
                }
            });
        }
    });
});
app.put("/blogs/:id",function(req,res){
    console.log("\n\n\n\nPUT\n\n\n");
    console.log(req.param.id);
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
            console(err);
            //res.redirect("/blogs");
        }
        else{
            console.log("UPDATED");
            console.log(updatedBlog);
            res.redirect("/blogs");
        }
    });
    res.send("Update one blog");
});
app.delete("/blogs/:id",function(req,res){
    
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//Other Routes
app.get("/",function(req,res){
    res.send("homepage");
});
app.get("/error",function(req,res){
    res.send("error");
});
app.get("/*",function(req,res){
    res.send("404 not found");
});
app.listen(8080,function(){
    console.log("EXPRESS");
});