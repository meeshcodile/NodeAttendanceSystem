const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const internSignInSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },

    internId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },

})

const InternSignIn = mongoose.model('internSignIn', internSignInSchema);

module.exports = InternSignIn;