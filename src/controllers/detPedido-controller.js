const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { authJwt } = require("../middlewares");
const { sequelize } = require("../models");

//Inicializando as models e as recebendo
const { initModels } = require("../models/init-models");
var { pedido, det_pedido } = initModels(sequelize)

module.exports = {

    ////GET 

    //Buscar os pedidos por ID do pedido
    buscarPorIdPedido: async (req, res, next) => {
        var pedidos = await pedido.findByPk(req.params.id, {
            include: ['det_pedidos', 'servicos']
        });

        //Retorna mensagem se encontrar um pedido nulo.
        if (pedidos == null) {
            return res.json({ message: `Nenhum pedido com id ${req.params.id}` });
        }

        //Só passa para o serializer se o nif fornecido no login for o mesmo ao nif cadastrado no pedido.
        else if (req.user.nif === pedidos.nif) {
            req.pedidos = [pedidos]
            next();
            return;
        }

        // Verificando se o usuário que está querendo ver os detalhes do pedido de outro usuário é administrador
        else {
            req.pedidos = [pedidos]
            authJwt.isAdmin(req, res, next);
        }
    }
}