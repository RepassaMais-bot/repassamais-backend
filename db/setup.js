const db = require("./conn");

db.serialize(()=>{

  db.run(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evento_id INTEGER,
      marca TEXT,
      modelo TEXT,
      versao TEXT,
      ano_fab INTEGER,
      ano_mod INTEGER,
      preco REAL,
      km INTEGER,
      combustivel TEXT,
      laudo TEXT,
      banco TEXT,
      cidade TEXT,
      estado TEXT,
      fotos TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Tabela VEICULOS criada com sucesso");

});
db.run(`
  CREATE TABLE IF NOT EXISTS ofertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    veiculo_id INTEGER,
    valor REAL,
    status TEXT DEFAULT 'aguardando',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Tabela OFERTAS criada com sucesso");
