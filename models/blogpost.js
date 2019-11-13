const mongoose = require('mongoose')
const {Schema} = mongoose

const blogPostSchema =new Schema ({
    blogPost:{
        type:String,
        required:true
    },
    CreationDate:{
        type:Date,
        required:true
    },
    fullName:{
        type:String,
        required:true
    }
})

const blogPost = mongoose.model('blogPost', blogPostSchema)
module.exports = blogPost