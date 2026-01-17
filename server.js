const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./db/database");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "REPASSAMAIS_SUPER_SEGREDO";

// 🔹 Middleware de proteção
function auth(req,res,next){
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({error:"Token ausente"});

  try{
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  }catch{
    res.status(401).json({error:"Token inválido"});
  }
}

// 🔹 Health
app.get("/health",(req,res)=>{
  res.send("API RepassaMais OK");
});

// 🔹 Cadastro
app.post("/auth/register",(req,res)=>{
  const { email, senha } = req.body;
  const hash = bcrypt.hashSync(senha,8);

  db.run(
    "INSERT INTO users(email,password_hash) VALUES(?,?)",
    [email, hash],
    err=>{
      if(err) return res.json({error:"Email já cadastrado"});
      res.json({success:true});
    }
  );
});

// 🔹 Login
app.post("/auth/login",(req,res)=>{
  const { email, senha } = req.body;

  db.get(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err,user)=>{
      if(!user) return res.json({error:"Login inválido"});
      if(user.status==="blocked") return res.json({error:"Usuário bloqueado"});

      const ok = bcrypt.compareSync(senha,user.password_hash);
      if(!ok) return res.json({error:"Login inválido"});

      const token = jwt.sign(
        { id:user.id, role:user.role },
        JWT_SECRET,
        { expiresIn:"7d" }
      );

      res.json({
        success:true,
        token,
        role:user.role
      });
    }
  );
});

// 🔹 Quem sou eu
app.get("/me",auth,(req,res)=>{
  db.get(
    "SELECT id,email,role,status,plan_until FROM users WHERE id=?",
    [req.user.id],
    (err,user)=>res.json(user)
  );
});

// 🔹 Admin lista usuários
app.get("/admin/users",auth,(req,res)=>{
  if(req.user.role!=="admin") return res.sendStatus(403);

  db.all("SELECT id,email,role,status FROM users",[],(e,rows)=>{
    res.json(rows);
  });
});

// 🔹 Admin bloqueia usuário
app.post("/admin/block/:id",auth,(req,res)=>{
  if(req.user.role!=="admin") return res.sendStatus(403);

  db.run("UPDATE users SET status='blocked' WHERE id=?",[req.params.id]);
  res.json({success:true});
});

// 🔹 Home
app.get("/",(req,res)=>{
  res.send("API RepassaMais rodando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("Rodando na porta",PORT));
