const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()

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
            message:"Username and password are required"
        })
    }
    
    console.log("USERNAME:", username)
    console.log("PASSWORD:", password)

    res.json({
        message: "Register Success",

        user: {
            username: username,
            password: password,
        }
    })

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    )

})