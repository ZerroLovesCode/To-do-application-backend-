const mongoose = require("mongoose")
const {MONGO_URL} = require("../.config.js")

mongoose.connect(MONGO_URL)

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    todos : [
        {
            title: String,
            description: String,
            priority: Number,
            completed: Boolean
        }
    ]
})

const User = mongoose.model('User', userSchema)

module.exports = {User}