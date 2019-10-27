const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newTopicSchema = new Schema({
    projectTopic :{
        type:String,
        required:true
    }
})



const Topic = mongoose.model('projectTopic', newTopicSchema)
module.exports = Topic