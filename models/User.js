const db = require("../db/conn");

// cria tabela automaticamente
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  senha TEXT,
  role TEXT,
  creditos INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pendente',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

function createUser(data, callback) {
  const { email, senha, role } = data;

  db.run(
    `INSERT INTO users (email, senha, role) VALUES (?, ?, ?)`,
    [email, senha, role],
    callback
  );
}

function findUser(email, callback) {
  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    callback
  );
}

function updateCreditos(id, creditos, callback) {
  db.run(
    `UPDATE users SET creditos = ? WHERE id = ?`,
    [creditos, id],
    callback
  );
}

module.exports = {
  createUser,
  findUser,
  updateCreditos
};
