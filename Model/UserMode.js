const mongoose = require('mongoose')


//creating the structure of the user collection
const mySchema = mongoose.Schema({
    userName : {
        type : String,
        required : true
    },

    userID : {
     type : String
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required :true
    }



}, {timeStamp : true})


module.exports = mongoose.model('users', mySchema)