const mongoose = require("mongoose")
const { MONGO_URL } = require("../.config.js")

mongoose.connect(MONGO_URL)

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
})

const todoSchema = new mongoose.Schema({
    username: String,
    todos: [
        {
            title: String,
            description: String,
            priority: Number,
            completed: Boolean
        }
    ]
})

const User = mongoose.model('User', userSchema)
const Todo = mongoose.model("Todo", todoSchema)

module.exports = { User, Todo}