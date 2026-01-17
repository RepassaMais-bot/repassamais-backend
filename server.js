const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { email:"admin@teste.com", senha:"123", role:"admin" },
  { email:"user@teste.com", senha:"123", role:"user" }
];

app.post("/login",(req,res)=>{
  const { email, senha } = req.body;

  const user = users.find(u=>u.email===email && u.senha===senha);

  if(!user){
    return res.json({ success:false, message:"Login inválido" });
  }

  res.json({
    success:true,
    token:"TOKEN_"+email,
    role:user.role
  });
});

app.get("/",(req,res)=>{
  res.send("API RepassaMais rodando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log("Rodando na porta", PORT);
});

