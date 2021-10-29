const Sequelize = require("sequelize");
const { initModels } = require("../models/init-models")
var { servico } = initModels(sequelize)

module.exports = {

    servicosGet: async (req, res) => {
        const servicos = await servico.findAll()
        res.json(servicos)
    },

    servicosPut: async (req, res) => {
        var { id } = req.params;
        var { quantidade, valor_unitario } = req.body;

        const servicos = await servico.findByPk(id)

        if (servicos === null) {
            return res.json({ message: "Não há nenhum serviço" })
        }
        else {
            await servicos.update({ quantidade, valor_unitario })
            return res.json({ message: `Servico ${servicos.id_servico} atualizado com sucesso!` })
        }
    }
}