const db = require("../db/conn");

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT UNIQUE,
  senha TEXT,
  role TEXT
)
`);

module.exports = {
  create(user, cb) {
    const sql = `INSERT INTO users (nome,email,senha,role) VALUES (?,?,?,?)`;
    db.run(sql, [user.nome, user.email, user.senha, user.role], cb);
  },

  findByEmail(email, cb) {
    db.get("SELECT * FROM users WHERE email = ?", [email], cb);
  }
};
