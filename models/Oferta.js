const db = require("../db/conn");

module.exports = {

  criar:(o)=>{
    return new Promise((resolve,reject)=>{
      db.run(`
        INSERT INTO ofertas (user_id, veiculo_id, valor, status)
        VALUES (?,?,?,?)
      `,
      [o.user_id, o.veiculo_id, o.valor, "aguardando"],
      function(err){
        if(err) reject(err);
        else resolve(this.lastID);
      });
    });
  },

  listarPorUsuario:(user_id)=>{
    return new Promise((resolve,reject)=>{
      db.all(
        "SELECT * FROM ofertas WHERE user_id=? ORDER BY created_at DESC",
        [user_id],
        (err,rows)=>{
          if(err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  listarTodas:()=>{
    return new Promise((resolve,reject)=>{
      db.all("SELECT * FROM ofertas ORDER BY created_at DESC",(err,rows)=>{
        if(err) reject(err);
        else resolve(rows);
      });
    });
  },

  atualizarStatus:(id,status)=>{
    return new Promise((resolve,reject)=>{
      db.run(
        "UPDATE ofertas SET status=? WHERE id=?",
        [status,id],
        err=>{
          if(err) reject(err);
          else resolve(true);
        }
      );
    });
  }

};
