const {JWT_SECRET} = require("../.config.js")
const jwt = require("jsonwebtoken")

function userMiddleware(req, res, next){
    const auth = req.headers.authorization
    const token = auth.split(" ")[1]
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.username){
            req.username = decoded.username;
            next();
        }
        else{
            res.status(403).json({
                msg: "incorrect information sent, please try again."
            })
        }
    }
    catch(e){
        res.status(403).json({
            msg: "You are not authorized, please sign in first"
        })
    }

}

module.exports = {userMiddleware}