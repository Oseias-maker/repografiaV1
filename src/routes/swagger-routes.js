const swaggerUi = require("swagger-ui-express");
<<<<<<< HEAD
const swaggerDocsV1 = require("../../info_api/docs/swagger/v1/swaggerV1.config.json");
const swaggerDocsV2 = require("../../info_api/docs/swagger/v2/swaggerV2.config.json");
=======
const swaggerDocsV1 = require("../../info_api/documentacao/swagger/v1/swaggerV1.config.json");
const swaggerDocsV2 = require("../../info_api/documentacao/swagger/v2/swaggerV2.config.json");
>>>>>>> c1b15da34c6995aa35f96da988dfedbe7728dec0

module.exports = function (app) {
  //Swagger Routes

  // //Versão 1
  app.use('/v1/docs', swaggerUi.serve, (...args) => swaggerUi.setup(swaggerDocsV1)(...args));
 
  // //Versão 2
  app.use('/v2/docs', swaggerUi.serve, (...args) => swaggerUi.setup(swaggerDocsV2)(...args));

};
