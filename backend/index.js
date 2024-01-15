const express = require("express");
const {userMiddleware} = require("./middleware/userMiddleware")
const {User} = require("./db")
const bodyParser = require("body-parser")

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    res.json({
        msg: "welcome to the landing page"
    })
})

app.post("/signup", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password)
    try{    
        await User.create({
            username: username,
            password: password
        })
    }
    catch(e){
        console.log(e)
    }

    res.json({
        msg: "User created successfully!"
    })
})

app.post("/signin", userMiddleware, (req, res)=>{
    res.json("Control reaches here!")
})

app.listen(PORT)
