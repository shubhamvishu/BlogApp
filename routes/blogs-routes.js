const router = require('express').Router();
var express =  require("express"),
    app = express();
var Blog = require('../models/blogs');

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
    //res.send("SHOW POSTS");

    Blog.find({},function(err,posts){
        var data = {
            posts:posts,
            oneblog:null,
            isloggedin:true,
            profile:req.session.passport.user
        };
        if(err){
            console.log("Error parsing DB");
            res.redirect("/news");
        }
        else{
            console.log("GET ALL POSTS");
            console.log(data.profile);
            res.render("blogs",{posts:data});
        }
    });
    //res.render("posts");
});
router.get("/new",isLoggedIn,function(req,res){
    var data = {
        posts:null,
        oneblog:null,
        isloggedin:true,
        profile:req.session.passport.user
    };
    res.render("newpost",{posts:data});
});
router.post("/",isLoggedIn,function(req,res){
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
            res.redirect("/blogs");
        }
        else{
            console.log("Added");
            //res.send("heyy");
        }
    });
    //console.log(req.body.title);
    //res.redirect("/blogs/posts");
});
router.get("/:id",isLoggedIn,function(req,res){
    //res.send("<h1>Hello news</h1>");
    console.log("REQ id:"+ req.params.id);
    var oneBlog = null;
    Blog.findById(req.params.id,function(err,onepost){
        if(err){
            console.log(err);
            console.log("Error parsing DB I");
            res.redirect("/blogs");
        }
        else{
            console.log("My POST");
            console.log(onepost);
            oneBlog = onepost;

            Blog.find({},function(err,allposts){
                console.log("X=");
                console.log(oneBlog);
                var data = {
                    posts:allposts,
                    oneblog:onepost,
                    isloggedin:true,
                    profile:req.session.passport.user
                };
                if(err){
                    console.log("Error parsing DB II");
                    res.redirect("/blogs");
                }
                else{
                    console.log("GET 1 BLOG ID");
                    console.log(oneBlog);
                    res.render("blogs",{posts:data});
                }
            });
        }
    });
    //res.send("SHOWWW");

});
router.get("/:id/edit",isLoggedIn,function(req,res){
    var oneBlog = null;

    Blog.findById(req.params.id,function(err,posts){
        if(err){
            console.log(err);
            console.log("Error parsing DB");
            res.redirect("/blogs");
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
                    oneblog:oneBlog,
                    profile:req.session.passport.user
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
router.put("/:id",isLoggedIn,function(req,res){
    console.log("\n\n\n\nPUT\n\n\n");
    console.log(req.param.id);
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
            console(err);
            res.redirect("/blogs");
        }
        else{
            console.log("UPDATED");
            console.log(updatedBlog);
            res.redirect("/blogs");
        }
    });
    //res.send("Update one blog");
});
router.delete("/:id",isLoggedIn,function(req,res){
    
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

module.exports = router;