const express = require("express");
const router = express.Router();
const User = require("../models/User");

// cadastro
router.post("/register", (req,res)=>{
  const { email, senha } = req.body;

  if(!email || !senha){
    return res.status(400).json({ success:false });
  }

  User.createUser(
    { email, senha, role:"user" },
    (err)=>{
      if(err){
        return res.json({ success:false, message:"Usuário já existe" });
      }
      res.json({ success:true });
    }
  );
});

// login real
router.post("/login",(req,res)=>{
  const { email, senha } = req.body;

  User.findUser(email,(err,user)=>{
    if(!user || user.senha !== senha){
      return res.json({ success:false });
    }

    res.json({
      success:true,
      user
    });
  });
});

module.exports = router;
