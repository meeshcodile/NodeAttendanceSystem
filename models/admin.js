const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema



const adminSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


adminSchema.plugin(passportLocalMongoose);
const Admin =mongoose.model('admin', adminSchema)
module.exports = Admin