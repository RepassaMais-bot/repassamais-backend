const express = require("express");
const router = express.Router();
const Oferta = require("../models/Oferta");

// criar oferta (cliente)
router.post("/", async (req,res)=>{
  try{
    const id = await Oferta.criar(req.body);
    res.json({ success:true, id });
  }catch(e){
    res.status(500).json({ success:false, error:e.message });
  }
});

// listar ofertas do usuário
router.get("/usuario/:id", async (req,res)=>{
  try{
    const data = await Oferta.listarPorUsuario(req.params.id);
    res.json(data);
  }catch(e){
    res.status(500).json({ success:false });
  }
});

// admin listar todas
router.get("/admin", async (req,res)=>{
  try{
    const data = await Oferta.listarTodas();
    res.json(data);
  }catch(e){
    res.status(500).json({ success:false });
  }
});

// admin atualizar status
router.put("/:id", async (req,res)=>{
  try{
    await Oferta.atualizarStatus(req.params.id, req.body.status);
    res.json({ success:true });
  }catch(e){
    res.status(500).json({ success:false });
  }
});

module.exports = router;
