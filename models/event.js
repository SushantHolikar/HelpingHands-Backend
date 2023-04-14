const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
  summary: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: false,
    },
    date:{
      type:Date,
      default:Date.now()
  },
  time: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  },
 
)
module.exports = mongoose.model("Event", EventSchema)
