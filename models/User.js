const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: 
    {type:String},
    email: {type:String},
    password: {type:String},
    NgoID: {type:String},
    verified: {type:Boolean},
    date:{
        type:Date,
        default:Date.now()
    },
    adminVerified:{type:String,default:"1"},
    profileImage:{
        type:String,
        default:"https://cdn.onlinewebfonts.com/svg/img_258694.png"
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User ;