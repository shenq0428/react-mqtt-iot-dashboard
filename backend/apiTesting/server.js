const express = require("express")
const cors = require("cors")
require("dotenv").config()
//json web tken for authentication
const jwt = require("jsonwebtoken")

const app = express()

const users = []

// MIDDLEWARE
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
        password
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
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
    //return token and user info
    res.json({
        message: "Login Success",
        user: { username: user.username },
        token
    })
})

app.get("/dashboard", (req, res) => {
    console.log("DASHBOARD ROUTE HIT")
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
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            )

        res.json({
            message: "Protected Dashboard Access",
            user: decoded
        })
    } catch (error) {
        res.status(401).json({
            message: "Invalid Token"
        })

    }

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    )

})