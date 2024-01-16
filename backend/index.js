const express = require("express");
const { userMiddleware } = require("./middleware/userMiddleware")
const { User, Todo } = require("./db")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./.config");

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        msg: "welcome to the landing page"
    })
})

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // console.log(username, password)
    try {
        const user = await User.create({
            username: username,
            password: password
        })

        await Todo.create({
            username: username,
            todos: []
        })
    }
    catch (e) {
        console.log(e)
    }

    res.json({
        msg: "User created successfully!"
    })
})

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({
        username,
        password
    })
    if (user) {
        const token = jwt.sign({ username: username }, JWT_SECRET);
        res.json({
            msg: "Sign in successful!",
            token
        })
    }
    else {
        res.json({
            msg: "User does not exist, please sign up first."
        })
    }
})

app.post("/add-todo", userMiddleware, async (req, res) => {
    const username = req.username;
    const title = req.body.title;
    const description = req.body.description;
    const priority = req.body.priority;
    const id = req.body.id;
    const completed = false;

    const newTodo = {
        username: username,
        id: id,
        title: title,
        description: description,
        priority: priority,
        completed: completed
    }

    await Todo.updateOne({ username: username }, {
        "$push": {
            todos: newTodo
        }
    })

    res.json({
        msg: "To do added successfully!"
    })

})

app.get("/get-todos", userMiddleware, async (req, res) => {
    const username = req.username;
    const response = await Todo.find({ username })
    const todos = response[0].todos
    res.json({
        todos
    })
})

app.patch("/update-todo", userMiddleware, async (req, res) => {
    const username = req.username;
    const target = req.body.target;
    const value = req.body.value;
    const id = req.body.id;

    const updateObj = { [`todos.$.${target}`]: value }
    await Todo.updateOne({ username, "todos.id": id },
        {
            "$set": updateObj
        })
    res.json({
        msg: "Target updated"
    })
})

app.listen(PORT)
