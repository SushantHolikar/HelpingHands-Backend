const express=require("express")
const bodyParser = require("body-parser");
const User=require("../models/User")
const Donor=require("../models/Donor")
const Post=require("../models/post")
const Event=require("../models/event")
const router=express.Router()
const app =express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');
const DonationCard = require("../models/DonationCard");

router.get('/getuser',
  async (req, res) => {
    await User.find()
    .select("-password")
    .sort({date:-1})
    .limit(9)
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });


  router.get('/getspecificuser/:email',
  async (req, res) => {
    await User.find({email:req.params.email})
    .select("-password")
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });


  router.get('/getdonor',
  async (req, res) => {
    await Donor.find()
    .select("-password")
    .sort({date:-1})
    .limit(9)
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });

  router.get('/getspecificdonor/:email',
  async (req, res) => {
    await Donor.find({email:req.params.email}).select("-password")
   .exec()
   .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });

  router.get('/getuserforhome',
  async (req, res) => {
    await User.find()
    .select("-password")
    .sort({date:-1})
    .limit(5)
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });
  
  router.get('/getpost',
  async (req, res) => {
    await Post.find()
    .sort({date:-1})
    // .limit(15)
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });

  router.get('/getdonationcard',
  async (req, res) => {
    await DonationCard.find()
    .sort({date:-1})
    // .limit(15)
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });

  router.get("/getspecificdonationcard/:donationcardId", async (req, res) => {
    try {
      const donationcard = await DonationCard.findById(req.params.donationcardId)
      res.status(200).json(donationcard)
    } catch (error) {
      res.status(404).json(error)
    }
  })

  router.get('/getEvent',
  async (req, res) => {
    await Event.find()
    .sort({date:-1})
    .limit(9)
  .exec()
  .then(p=>{
      res.status(200).json(p)
  })
  .catch(error=>console.log(error));
  });


// get single event
router.get("/getspecificevent/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
    res.status(200).json(event)
  } catch (error) {
    res.status(404).json(error)
  }
})
 
//get single post
router.get("/getspecificpost/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json(error)
  }
})

//get similar labels
router.get("/getlabel/:postId", async (req, res) => {
  try {
    const post = await DonationCard.find({label:req.params.postId})
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json(error)
  }
})
 

//amount DonateUs

router.put('/donors/:email/donate/:amount', async (req, res) => {
  const { email } = req.params;
  const { amount } = req.params;
  try {
    const donor = await Donor.findOne({ email: email });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    donor.amount += parseInt(amount);
    await donor.save();
    res.json(donor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/users/:email/donate/:amount', async (req, res) => {
  const { email } = req.params;
  const { amount } = req.params;
  try {
    const donor = await User.findOne({ email: email });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    donor.amount += parseInt(amount);
    await donor.save();
    res.json(donor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//Specific Donation NGO

router.put('/donation-cards/:donationcardId/update-fund/:amount', async (req, res) => {
  const { donationcardId, amount } = req.params;
  try {
    const card = await DonationCard.findById(donationcardId);
    if (!card) {
      return res.status(404).json({ message: 'Donation card not found' });
    }
    card.currentFund += parseInt(amount);
    await card.save();
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports=router