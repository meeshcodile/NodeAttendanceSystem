const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newTopicSchema = new Schema({
    // group:{
    //     type:String,
    //     required:true
    // },
    projectTopic:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
})



const Topic = mongoose.model('projectTopic', newTopicSchema)
module.exports = Topic