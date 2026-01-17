const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// LOGIN
app.post("/login",(req,res)=>{
  const { email, senha } = req.body;

  let role = "user";

  if(email === ADMIN_EMAIL && senha === ADMIN_PASSWORD){
    role = "admin";
  }

  // aqui depois entra banco real
  if(!email || !senha){
    return res.status(400).json({ success:false, message:"Dados inválidos" });
  }

  const token = jwt.sign(
    { email, role },
    JWT_SECRET,
    { expiresIn:"7d" }
  );

  res.json({
    success:true,
    token,
    role
  });
});

// ROTA PROTEGIDA
app.get("/me",(req,res)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error:"Sem token" });

  try{
    const token = auth.replace("Bearer ","");
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json(decoded);
  }catch(e){
    res.status(401).json({ error:"Token inválido" });
  }
});

app.get("/",(req,res)=>{
  res.send("API RepassaMais rodando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Rodando na porta",PORT));
