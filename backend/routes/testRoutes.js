const express = require("express")
const router = express.Router()

//get
router.get("/test", (req, res) => {
  res.json({
    message: "Backend get api working from routes/testRoutes.js",
  })
})
//post api use with frontend fetch to test post api
router.post("/alarm", (req, res) => {
  console.log("Received post data from routes/testRoutes.js")
  console.log(req.body)

  res.json({
    message: "Alarm received",
    receivedData: req.body,
  })
})

//memory state example
let threshold = 16
router.get("/threshold", (req, res) => {
  console.log("Threshold requested, current value:", threshold)
  res.json({
    currentThreshold: threshold,
  })

})

router.post("/threshold", (req, res) => {

  threshold = req.body.threshold

  console.log("Threshold updated to:", threshold)

  res.json({
    message: "Threshold updated",
    newThreshold: threshold,
  })

})

// req.query exmaple
router.get("/search", (req, res) => {

  console.log(req.query)

  res.json({
    queryData: req.query,
  })
})

module.exports = router