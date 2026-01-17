const express = require("express");
const router = express.Router();
const Oferta = require("../models/Oferta");

// CRIAR OFERTA
router.post("/", async (req,res)=>{
  try{
    const { user_id, veiculo_id, valor } = req.body;

    if(!user_id || !veiculo_id || !valor){
      return res.status(400).json({ error:"Dados incompletos" });
    }

    const id = await Oferta.criar({
      user_id,
      veiculo_id,
      valor
    });

    res.json({
      success:true,
      id
    });

  }catch(e){
    res.status(500).json({ error:e.message });
  }
});

// LISTAR OFERTAS DO USUÁRIO
router.get("/usuario/:id", async (req,res)=>{
  const dados = await Oferta.listarPorUsuario(req.params.id);
  res.json(dados);
});

// LISTAR TODAS (ADMIN)
router.get("/admin", async (req,res)=>{
  const dados = await Oferta.listarTodas();
  res.json(dados);
});

// ATUALIZAR STATUS
router.put("/:id", async (req,res)=>{
  const { status } = req.body;
  await Oferta.atualizarStatus(req.params.id,status);
  res.json({ success:true });
});

module.exports = router;
