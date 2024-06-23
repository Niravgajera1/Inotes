const express = require("express");
const User = require("./../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middelware/fetchuser");
const router = express.Router();

const JWT_SECRET = "MYSECRET@111"

// create user 
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "user already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass  = await bcrypt.hash(req.body.password,salt)
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
         user:{
          id:User._id
         }
      }
       const authtoken = jwt.sign(data,JWT_SECRET)
       res.json({authtoken})
    } catch (error) {
        console.log(error)
    }
  }
);

// login user
router.post("/login", [
  body("email","enter valid email").isEmail(),
  body("password","passworn cannnot be empty").exists(),
], async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password} = req.body;
  try {
     const user = await User.findOne({email});
     if(!user){
      res.status(400).json({error:"please enter the correct email or password"});
     }

     const passwordCompare = await bcrypt.compare(password,user.password);
     if(!passwordCompare){
      res.status(400).json({error:"please enter the correct email or password"});
     }

     const data = {
       user:{
         id:user.id
       }
     }
     const authtoken = jwt.sign(data,JWT_SECRET)
     res.json({authtoken})
  } catch (error) {
     console.log(error)
  }
})

/// get logged in user data

router.post("/getuser",fetchuser,async (req,res)=>{
  try {
    userID = req.user.id
    const user  = await User.findById(userID).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error)
  }
})


module.exports = router;
