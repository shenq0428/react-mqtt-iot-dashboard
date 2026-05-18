const express =  require ("express")
const router = express.Router()

//get
router.get("/test",(req,res)=>{
    res.json({
        message:"Backend api working from routes/testRoutes.js",
    })
})
//post
router.post("/alarm",(req,res)=>{
    console.log("Received post data from routes/testRoutes.js")
    console.log(req.body)

    res.json({
        message:"Alarm received",
        receivedData:req.body,
    })
})

//memory state
let threshold = 16
router.get("/threshold", (req, res) => {

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

module.exports = router