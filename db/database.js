const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "app.db");
const db = new sqlite3.Database(dbPath);

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',             -- user | admin
  status TEXT NOT NULL DEFAULT 'pending',        -- pending | approved | blocked
  name TEXT,
  phone TEXT,
  cpf TEXT,
  cnpj TEXT,
  company_name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  doc_type TEXT NOT NULL,                        -- rg | cnh | comprovante_endereco | etc
  file_url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,                            -- disputa | compra_direta
  is_active INTEGER NOT NULL DEFAULT 1,
  start_at TEXT,
  end_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY,                        -- usa o id do anúncio
  event_id INTEGER NOT NULL,
  data_json TEXT NOT NULL,                       -- guarda tudo do veículo (json string)
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credits_wallet (
  user_id INTEGER PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 0,            -- créditos disponíveis
  reserved INTEGER NOT NULL DEFAULT 0,           -- créditos reservados
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,                            -- add | reserve | release | spend
  amount INTEGER NOT NULL,
  reference TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  vehicle_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',           -- sent | accepted | rejected | superado | arrematado
  max_limit INTEGER,                             -- limite do cliente, se você usar
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  vehicle_id INTEGER NOT NULL,
  offer_id INTEGER,
  step TEXT NOT NULL DEFAULT 'oferta_enviada',   -- etapa atual
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchase_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER NOT NULL,
  step TEXT NOT NULL,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(purchase_id) REFERENCES purchases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,                            -- new_offer | new_doc | etc
  payload_json TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

module.exports = db;
