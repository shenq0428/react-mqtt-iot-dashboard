const express = require("express")
const cors = require("cors")
require("dotenv").config()
//json web tken for authentication
const jwt = require("jsonwebtoken")

const app = express()

const users = []


// MIDDLEWARE resuseable authentication function
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization
    // NO TOKEN
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        })
    }
    // REMOVE "Bearer "
    const token = authHeader.split(" ")[1]
    try {
        //jwt verify will get the iat and exp from the token and check if it's valid
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.user = decoded
        next()
    }
    catch (error) {
        res.status(401).json({
            message: "Invalid Token"
        })
    }
}


app.use(cors())
app.use(express.json())

// TEST ROUTE
app.get("/", (req, res) => {

    res.json({
        message: "Nova Lobster Backend Running"
    })

})

// REGISTER API
app.post("/register", (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        })
    }

    //console.log("USERNAME:", username)
    //console.log("PASSWORD:", password)

    //check existing user
    const existingUser = users.find((user) => user.username == username)
    if (existingUser) {
        return res.status(400).json({
            message: "Username already exists"
        })
    }

    // CREATE USER
    const newUser = {
        username,
        password,
        role: "admin"
    }

    users.push(newUser)
    console.log(users)

    res.json({
        message: "Register Success",
        users
    })

})

app.post("/login", (req, res) => {
    const { username, password } = req.body

    //find user
    const user = users.find((user) => user.username == username)
    //user not found
    if (!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }
    //check password
    if (user.password !== password) {
        return res.status(400).json({
            message: "Incorrect password"
        })
    }

    //login success
    //generate JWT token
    const token = jwt.sign(
        {
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        },
    )
    //return token and user info
    res.json({
        message: "Login Success",
        user: { username: user.username },
        token
    })
})

// PROTECTED DASHBOARD ROUTE by using the authenticateToken middleware (reuseable for any route that needs authentication))
app.get("/dashboard", authenticateToken, (req, res) => {

    res.json({
        message: "Protected Dashboard Access",
        decoded_user: req.user
    })
}

)

//admin route example
app.get("/admin", authenticateToken, (req, res) => {
    //check if user is admin
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied"
        })
    }
    res.json({
        message: "Welcome Admin",
        decoded_user: req.user
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    )

})