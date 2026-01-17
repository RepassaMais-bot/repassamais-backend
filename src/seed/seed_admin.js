require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../db/database");

const email = process.env.ADMIN_EMAIL;
const pass = process.env.ADMIN_PASSWORD;

if(!email || !pass){
  console.log("Faltou ADMIN_EMAIL/ADMIN_PASSWORD no .env");
  process.exit(1);
}

const hash = bcrypt.hashSync(pass, 10);

db.run(
  "INSERT OR IGNORE INTO users(email,password_hash,role,status) VALUES(?,?, 'admin','approved')",
  [email, hash],
  (err)=>{
    if(err) console.log(err);
    else console.log("Admin seed OK:", email);
    process.exit(0);
  }
);
