const mongoose = require('mongoose')
const { Schema } = mongoose


const exeatSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    
    internId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    fullName: {
        type: String,
        required: true
    }
})

const InternExeat = mongoose.model('internExeat', exeatSchema)
module.exports = InternExeat