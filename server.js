require('./config/db');
var cors=require('cors');
const app = require('express')();
const port = process.env.PORT || 5000 ;
const multer = require("multer")
const path = require("path")
const authPost = require("./routes/posts")
const authEvent = require("./routes/events")
const authDonationCard = require("./routes/DonationCard")


const UserRouter = require('./api/User');
const DonorRouter = require('./api/Donor')
app.use("/api/auth",require("./routes/auth"))
app.use(cors());

const bodyParser = require ('express').json ;
app.use(bodyParser());
app.use('/user', UserRouter);
app.use('/donor', DonorRouter)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  const storage = multer.diskStorage({
    destination: (req, file, callb) => {
      callb(null, "images")
    },
    filename: (req, file, callb) => {
      //callb(null, "file.png")
      callb(null, req.body.name)
    },
  })

  const upload = multer({ storage: storage })
  app.post("/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded")
  })
  
  app.post("/payment", cors(), async (req, res) => {
    let { amount, id } = req.body
    try {
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: "₹",
        description: "Donation",
        payment_method: id,
        confirm: true
      })
      console.log("Payment", payment)
      res.json({
        message: "Payment successful",
        success: true
      })
    } catch (error) {
      console.log("Error", error)
      res.json({
        message: "Payment failed",
        success: false
      })
    }
  })
  

app.use("/posts", authPost)
app.use("/events", authEvent)
app.use("/donationcards", authDonationCard)
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})