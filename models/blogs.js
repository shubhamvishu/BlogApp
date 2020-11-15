var mongoose = require("mongoose");

var blogsSchema = new mongoose.Schema({
    title:String,
    author:String,
    date:String,
    imageLink:String,
    description:String
});

module.exports = mongoose.model("Blog",blogsSchema);
