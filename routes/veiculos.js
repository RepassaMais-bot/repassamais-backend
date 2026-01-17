const express = require("express");
const router = express.Router();

router.get("/:evento", (req, res) => {
  const evento = req.params.evento;

  res.json({
    evento,
    veiculos: []
  });
});

module.exports = router;
