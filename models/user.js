var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    

var UserSchema = new mongoose.Schema({
    name:String,
    logintype:Number,
    username: String,
    password: String,
    googleid:String,
    facebookid:String,
    hash:String,
    salt:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);