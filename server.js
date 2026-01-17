const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// rotas
const authRoutes = require("./routes/auth");
const eventosRoutes = require("./routes/eventos");
const veiculosRoutes = require("./routes/veiculos");
const ofertasRoutes = require("./routes/ofertas"); // 🔥 ADICIONADO

const app = express();

app.use(cors());
app.use(express.json());

// ===== ENV =====
const JWT_SECRET = process.env.JWT_SECRET || "segredo_local";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@teste.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123";

// ===== ROTA TESTE =====
app.get("/", (req, res) => {
  res.send("API RepassaMais rodando");
});

// ===== DEBUG ROTAS =====
app.get("/debug", (req, res) => {
  res.json({
    authRoutes: typeof authRoutes,
    eventosRoutes: typeof eventosRoutes,
    veiculosRoutes: typeof veiculosRoutes,
    ofertasRoutes: typeof ofertasRoutes
  });
});

// ===== LOGIN DIRETO (GLOBAL) =====
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      message: "Email e senha obrigatórios"
    });
  }

  let role = "user";

  if (email === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
    role = "admin";
  }

  const token = jwt.sign(
    { email, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    role
  });
});

// ===== ROTA PROTEGIDA =====
app.get("/me", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "Sem token" });
  }

  try {
    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json(decoded);
  } catch (e) {
    res.status(401).json({ error: "Token inválido" });
  }
});

// ===== ROTAS MODULARES =====
app.use("/auth", authRoutes);
app.use("/eventos", eventosRoutes);
app.use("/veiculos", veiculosRoutes);
app.use("/ofertas", ofertasRoutes); // 🔥 ADICIONADO

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API rodando na porta", PORT);
});
