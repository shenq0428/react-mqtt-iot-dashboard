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
//patch
router.patch("/device/:id", (req, res) => {

  console.log("PATCH device:", req.params.id)

  console.log(req.body)

  res.json({
    message: "Device updated",
    deviceId: req.params.id,
    updatedData: req.body,
  })

})
//delete function 
router.delete("/alarm/:id", (req, res) => {

  console.log("DELETE alarm:", req.params.id)

  res.json({
    message: "Alarm deleted",
    alarmId: req.params.id,
  })

})
// req.query exmaple
router.get("/search", (req, res) => {

  console.log(req.query)

  res.json({
    queryData: req.query,
  })
})
//route.params example
router.get("/device/:id", (req, res) => {
  console.log("Device id:", req.params.id)

  res.json({
    deviceId: req.params.id,
  })
})

router.get("/debug-ip", (req, res) => {

    res.json({
        ip: req.ip,
        forwardedFor: req.headers["x-forwarded-for"],
        remoteAddress: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
    });

});

module.exports = router