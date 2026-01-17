require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./src/db/database");
const { sign } = require("./src/utils/jwt");
const { auth, adminOnly } = require("./src/middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/health",(req,res)=>res.send("OK"));

// register (cria pending)
app.post("/auth/register",(req,res)=>{
  const { email, senha, name, phone, cpf } = req.body;
  if(!email || !senha) return res.status(400).json({error:"Email e senha obrigatórios"});

  const hash = bcrypt.hashSync(senha, 10);

  db.run(
    "INSERT INTO users(email,password_hash,status,name,phone,cpf) VALUES(?,?,'pending',?,?,?)",
    [email, hash, name || null, phone || null, cpf || null],
    function(err){
      if(err) return res.status(400).json({error:"Email já cadastrado"});
      // cria carteira
      db.run("INSERT OR IGNORE INTO credits_wallet(user_id,balance,reserved) VALUES(?,?,?)",[this.lastID,0,0]);
      return res.json({success:true, message:"Cadastro recebido. Aguardando aprovação."});
    }
  );
});

// login (só approved)
app.post("/auth/login",(req,res)=>{
  const { email, senha } = req.body;
  db.get("SELECT * FROM users WHERE email=?",[email],(err,user)=>{
    if(!user) return res.status(400).json({error:"Login inválido"});
    if(user.status === "blocked") return res.status(403).json({error:"Usuário bloqueado"});
    if(user.status !== "approved") return res.status(403).json({error:"Aguardando aprovação"});

    const ok = bcrypt.compareSync(senha, user.password_hash);
    if(!ok) return res.status(400).json({error:"Login inválido"});

    const token = sign({ id:user.id, role:user.role });
    return res.json({success:true, token, role:user.role});
  });
});

// me
app.get("/me", auth, (req,res)=>{
  db.get("SELECT id,email,role,status,name,phone,cpf,cnpj,company_name FROM users WHERE id=?",[req.user.id],(e,u)=>{
    res.json(u);
  });
});

// admin: listar usuarios pendentes
app.get("/admin/users", auth, adminOnly, (req,res)=>{
  db.all("SELECT id,email,status,role,name,phone,cpf FROM users ORDER BY id DESC",[],(e,rows)=>res.json(rows));
});

// admin: aprovar usuario
app.post("/admin/users/:id/approve", auth, adminOnly, (req,res)=>{
  db.run("UPDATE users SET status='approved' WHERE id=?",[req.params.id]);
  res.json({success:true});
});

// admin: bloquear usuario
app.post("/admin/users/:id/block", auth, adminOnly, (req,res)=>{
  db.run("UPDATE users SET status='blocked' WHERE id=?",[req.params.id]);
  res.json({success:true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("API rodando na porta", PORT));
