const mongoose = require('mongoose');
const {Schema} = mongoose;

const NotesSchema = new Schema({
    //for hidding particular user notes to another user notes then we will make a new field i.e user. here we can store the user's id
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user' //this refrence of user from "User.js" file 
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    tag: {
        type: String,
        default : "general"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notes', NotesSchema);