const express = require('express');

const router = express.Router();

router.post("",(req, res, next)=>{
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'post added successfully.'
  });
});

router.get("", (req,res,next)=>{
  const posts = [
    {
      id: "fsfsf12s2f",
      title: "First",
      content: "First content"
    },
    {
      id: "fsfsf12s2f2",
      title: "Second",
      content: "Second content"

    }
  ];

  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts
  });
});

module.exports = router;
