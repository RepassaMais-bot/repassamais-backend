const db = require("../db/conn");

db.run(`
CREATE TABLE IF NOT EXISTS ofertas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT,
  veiculo_id INTEGER,
  valor REAL,
  status TEXT
)
`);

module.exports = {
  create(oferta, cb) {
    const sql = `INSERT INTO ofertas (user_email, veiculo_id, valor, status) VALUES (?,?,?,?)`;
    db.run(sql, [oferta.user_email, oferta.veiculo_id, oferta.valor, oferta.status], cb);
  }
};
