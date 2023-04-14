const router = require("express").Router()
const DonationCard = require("../models/DonationCard");

//create post
router.post("/create", async (req, res) => {
  const newDonationCard = new DonationCard(req.body)
  try {
    const saveDonationCard = await newDonationCard.save()
    res.status(200).json(saveDonationCard)
  } catch (error) {
    res.status(500).json(error)
  }
})

// delete post
router.delete("/:id", async (req, res) => {
  try {

    const donationCard = await DonationCard.findById(req.params.id)
      try {
        await DonationCard.deleteOne({_id:req.params.id})
        res.status(200).json({"success":"DonationCard Has been deleted!","cards":donationCard})
      } catch (error) {
        res.status(500).json(error)
      }
    
  } catch (error) {
    res.status(500).json(error)
  }
})



// get all post
router.get("/", async (req, res) => {
  try {
    let donationCards
    {
      donationCards = await DonationCard.find()
    }
    res.status(200).json(donationCards)
  } catch (error) {
    res.status(404).json(error)
  }
})


module.exports = router
