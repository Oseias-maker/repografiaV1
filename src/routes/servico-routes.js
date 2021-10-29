const { authJwt } = require("../middlewares");
const controller = require("../controllers/servico-controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "accessToken, Origin, Content-Type, Accept"
    );
    next();
  });

  ////ADMIN 

  //GET

  //Exibindo serviços para o Administrador
  app.get("/servicos", [authJwt.validateToken, authJwt.isAdmin], controller.servicosGet);

  //PUT

  //Alterando quantidade e valor unitário do serviço
  app.put("/servicos/:id", [authJwt.validateToken, authJwt.isAdmin], controller.servicosPut);
};