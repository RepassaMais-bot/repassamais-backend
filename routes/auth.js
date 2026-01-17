const express = require("express");
const router = express.Router();

// Cadastro
router.post("/register", (req, res) => {
  const data = req.body;

  res.json({
    success: true,
    message: "Cadastro recebido",
    data
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      message: "Email e senha obrigatórios"
    });
  }

  let role = "user";

  if (email === process.env.ADMIN_EMAIL && senha === process.env.ADMIN_PASSWORD) {
    role = "admin";
  }

  res.json({
    success: true,
    token: "TOKEN_" + email,
    role
  });
});

module.exports = router;
