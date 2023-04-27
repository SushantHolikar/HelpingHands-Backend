    // currentFund: 20000,
    // goalFund: 30000,
const mongoose = require("mongoose")
const DonationCardSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        require: true,
      },
    title: {
      type: String,
      require: true,
    },
    email: {type:String},
    label: {
        type: String,
        require: true,
      },
      currentFund: {
        type: Number,
        default: 0

      },
      goalFund: {
        type: Number,
        require: true,
      },
      
    detail: {
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
  
  phone: {
    type: String,
    require: true,
  },
  },
 
)
module.exports = mongoose.model("DonationCard", DonationCardSchema)
