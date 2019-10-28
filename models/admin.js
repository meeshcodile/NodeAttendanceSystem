const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema



const adminSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    profilePicture: {
        type: String,
        default: 'https://res.cloudinary.com/dzl4he0xn/image/upload/v1571834880/sample.jpg'
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