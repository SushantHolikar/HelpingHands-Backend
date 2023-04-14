const router = require("express").Router()
const Post = require("../models/post")

//create post
router.post("/create", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savePost = await newPost.save()
    res.status(200).json(savePost)
  } catch (error) {
    res.status(500).json(error)
  }
})

// delete post
router.delete("/:id", async (req, res) => {
  try {

    const post = await Post.findById(req.params.id)
    console.log(post)
      try {
        await Post.deleteOne({_id:req.params.id})
        res.status(200).json({"success":"Post Has been deleted!","cards":post})
      } catch (error) {
        res.status(500).json(error)
      }
    
  } catch (error) {
    res.status(500).json(error)
  }
})

// update post
// router.put("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)
//       try {
//         const updatePost = await Post.findByIdAndUpdate(
//           req.params.id,
//           {
//             $set: req.body,
//           },
//           { new: true }
//         )
//         res.status(200).json(updatePost)
//       } catch (error) {
//         res.status(500).json(error)
//       }
   
//   } catch (error) {
//     res.status(500).json(error)
//   }
// })


// get post
// router.get("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)
//     res.status(200).json(post)
//   } catch (error) {
//     res.status(404).json(error)
//   }
// })

// get all post
router.get("/", async (req, res) => {
  try {
    let posts
    {
      posts = await Post.find()
    }
    res.status(200).json(posts)
  } catch (error) {
    res.status(404).json(error)
  }
})


module.exports = router
