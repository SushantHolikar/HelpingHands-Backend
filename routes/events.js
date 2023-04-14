const router = require("express").Router()
const Event = require("../models/event")

//create event
router.post("/create", async (req, res) => {
  const newEvent = new Event(req.body)
  try {
    const saveEvent = await newEvent.save()
    res.status(200).json(saveEvent)
  } catch (error) {
    res.status(500).json(error)
  }
})

// delete event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      try {
        await Event.deleteOne({_id:req.params.id})
        res.status(200).json({"success":"Post Has been deleted!","cards":event})
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
    let events
    {
      events = await Event.find()
    }
    res.status(200).json(posts)
  } catch (error) {
    res.status(404).json(error)
  }
})


module.exports = router
