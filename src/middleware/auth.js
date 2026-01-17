const { verify } = require("../utils/jwt");

function auth(req,res,next){
  const raw = req.headers.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : null;
  if(!token) return res.status(401).json({error:"Token ausente"});
  try{
    req.user = verify(token);
    next();
  }catch{
    return res.status(401).json({error:"Token inválido"});
  }
}

function adminOnly(req,res,next){
  if(req.user?.role !== "admin") return res.sendStatus(403);
  next();
}

module.exports = { auth, adminOnly };
