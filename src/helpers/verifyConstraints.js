const { initModels } = require("../models/init-models");
const { sequelize } = require("../models");
var models = initModels(sequelize);

const verifyConstraints = async ({ req, centro_custos, curso, modo_envio, avaliacao,
    tamanho_pagina, tipos_copia, tipos_capa, acabamento }) => {

    if (centro_custos) {
        var data = await models.centro_custos.findAll({
            where: { id_centro_custos: centro_custos }
        })
        req.centro_custos = data[0].descricao
    }

    if (curso) {
        let data = await models.curso.findAll({
            where: { id_curso: curso }
        })
        req.curso = data[0].descricao;
    }


    if (modo_envio) {
        let data = await models.modo_envio.findAll({
            where: { id_modo_envio: modo_envio }
        })
        req.modo_envio = data[0].descricao;
    }

    if (avaliacao) {
        let data = await models.avaliacao_pedido.findAll({
            where: { id_avaliacao_pedido: avaliacao }
        })
        req.avaliacao_pedido = data[0].descricao;
    }

    //DETALHES DO PEDIDO

    if (tamanho_pagina) {
        let data = await models.tamanho_pagina.findAll({
            where: { id_tamanho: tamanho_pagina }
        })
        req.tamanho_pagina = data[0].descricao;
    }

    if (tipos_copia) {
        let data = await models.tipos_copia.findAll({
            where: { id_tipos_copia: tipos_copia }
        })
        req.tipos_copia = data[0].descricao;
    }

    if (tipos_capa) {
        let data = await models.tipos_capa.findAll({
            where: { id_tipos_capa: tipos_capa }
        })
        //tc = [{id_tipos_capa: 2..., descricao: PVC...}]
        req.tipos_capa = data[0].descricao;
        //tipos capa = PVC
    }

    if (acabamento) {
        let data = await models.acabamento.findAll({
            where: { id_acabamento: acabamento }
        })
        req.acabamento = data[0].descricao;
    }
}

module.exports = verifyConstraints;