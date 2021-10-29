//Arquivo de configuração
const config = require("../.config/auth.config");
//Método que verifica o token enviado na requisição com o token e a palavra de segurança setada no back-end
const { verify } = require("jsonwebtoken");

// Inicializando as models e as recebendo
const { initModels } = require("../models/init-models");
var { usuario } = initModels(sequelize);

//Verifica se a requisição contém os valores setados no config.header e no config.secret
const validateToken = (req, res, next) => {
  const accessToken = req.header(config.jwt.header);

  if (!accessToken) return res.status(403).json({ error: "Você não está logado!" });
  try {
    const validToken = verify(accessToken, config.jwt.secret);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (error) {
    res.status(500).json({ error })
  }
  //  ==>  //Aqui ele passa os dados do usuário, nif: ... , email: ... 
  //Importante para usarmospor exemplo quando alguém realizar um pedido, 
  //para sabermos quem foi que realizou aquele pedido.

};


// Testando forma de autenticar o perfil do usuário (admin, user, moderator)
// const db = require("../models");
// const User = db.user;

isAdmin = (req, res, next) => {
  usuario.findByPk(req.user.nif).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].descricao === "admin") {
          next();
          return;
        }
      }
      res.status(403).json({
        message: "Você precisa ser Administrador para executar essa ação!"
      });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  usuario.findByPk(req.user.nif).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].descricao === "moderator") {
          next();
          return;
        }
      }
      res.status(403).json({
        message: "Você precisa ser Moderador para executar essa ação!"
      });
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.user.nif).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].descricao === "moderator") {
          next();
          return;
        }
        if (roles[i].descricao === "admin") {
          next();
          return;
        }
      }
      res.status(403).json({
        message: "Você precisa ser Administrador ou Moderador para executar essa ação!"
      });
    });
  });
};


const authJwt = {
  validateToken: validateToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;