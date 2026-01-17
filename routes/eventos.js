const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, nome: "Evento Disputa", tipo: "lance" },
    { id: 2, nome: "Evento Compra Direta", tipo: "compra" }
  ]);
});

module.exports = router;
