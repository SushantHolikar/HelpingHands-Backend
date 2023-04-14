const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    desc: {
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
    
  },
 
)
module.exports = mongoose.model("Post", PostSchema)
