const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
const bcrypt = require('bcryptjs')


const userSchema = new Schema({
   firstName:{
       type:String,
       required:true
   },
    startingDate:{
       type: String,
       required:true
   },
    
   department:{
       type:String,
       required:true
   },
    endingDate:{
       type:String,
       required:true
   },
   lastName:{
       type:String,
       required:true
   },
   profilePicture:{
       type:String,
        default:'https://res.cloudinary.com/dzl4he0xn/image/upload/v1571834880/sample.jpg'
   },
    projectTopic:{
        type:String,
        default:'default'
        // required:false
    },
   email:{
       type:String,
       required:true
   },
   phoneNumber:{
       type:String,
       required:true
   },
   institution:{
       type:String,
       required:true,
   },
   password:{
       type:String,
       required:true
   },
   isSignedIn:{
       type:Boolean,
       default:false
   },
   usertype:{
       type:String,
       required:true
   },
   internId:{
       type:String,
       required:true
   }
})

userSchema.plugin(passportLocalMongoose);
const User =mongoose.model('user', userSchema)
module.exports= User


module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt)
    } catch (error) {
        throw new Error('hashing failed', error)
    }
}
module.exports.comparePasswords = async (password, hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword)
    } catch (error) {
        throw new Error("comparing failed", error)
    }
}