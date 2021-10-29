const { verifyConstraints } = require("../helpers/");

const serializer = async (req, res, next) => {

    //Alterando descrição dos campos com constraints para enviar e-mail
    if (req.body.centro_custos) {
        var { centro_custos, tipos_copia, tipos_capa, modo_envio, tamanho_pagina, acabamento, curso } = req.body

        await verifyConstraints({req, centro_custos, curso, modo_envio, avaliacao_pedido: 0, tamanho_pagina, tipos_copia, tipos_capa, acabamento});
        next();
        return;
    }

    //Alterando descrição dos campos com constraints para enviar para o front-end
    if (req.pedidos) {
        var pedidos = [];
        for (let i = 0; i < req.pedidos.length; i++) {

            pedidos[i] = {
                id_pedido: req.pedidos[i].id_pedido,
                nif: req.pedidos[i].nif,
                titulo_pedido: req.pedidos[i].titulo_pedido,
                centro_custos: req.pedidos[i].id_centro_custos,
                curso: req.pedidos[i].id_curso,
                modo_envio: req.pedidos[i].id_modo_envio,
                avaliacao_pedido: req.pedidos[i].id_avaliacao_pedido,
                avaliacao_obs: req.pedidos[i].avaliacao_obs,
                custo_total: req.pedidos[i].custo_total,
                criado: req.pedidos[i].createdAt,
                atualizado: req.pedidos[i].updatedAt,
                detalhes_pedido: [{
                    id_det_pedido: req.pedidos[i].det_pedidos[0].id_det_pedido,
                    id_pedido: req.pedidos[i].det_pedidos[0].id_pedido,
                    tamanho: req.pedidos[i].det_pedidos[0].id_tamanho,
                    observacoes: req.pedidos[i].det_pedidos[0].observacoes,
                    tipo_copia: req.pedidos[i].det_pedidos[0].id_tipos_copia,
                    tipo_capa: req.pedidos[i].det_pedidos[0].id_tipos_capa,
                    acabamento: req.pedidos[i].det_pedidos[0].id_acabamento,
                    num_copias: req.pedidos[i].det_pedidos[0].num_copias,
                    num_paginas: req.pedidos[i].det_pedidos[0].num_paginas,
                    sub_total: req.pedidos[i].det_pedidos[0].sub_total_copias,
                    criado: req.pedidos[i].det_pedidos[0].createdAt,
                    atualizado: req.pedidos[i].det_pedidos[0].updatedAt
                }
                ],
                servico_1: [{
                    id_servico: req.pedidos[i].servicos[0].id_servico,
                    descricao: req.pedidos[i].servicos[0].descricao,
                    quantidade: req.pedidos[i].servicos[0].quantidade,
                    valor_unitario: req.pedidos[i].servicos[0].valor_unitario,
                }],
                servico_2: [{
                    id_servico: req.pedidos[i].servicos[1].id_servico,
                    descricao: req.pedidos[i].servicos[1].descricao,
                    quantidade: req.pedidos[i].servicos[1].quantidade,
                    valor_unitario: req.pedidos[i].servicos[1].valor_unitario,
                }]
            }
            
            var centro_custos = pedidos[i].centro_custos;
            var curso = pedidos[i].curso;
            var modo_envio = pedidos[i].modo_envio; 
            var avaliacao_pedido = pedidos[i].avaliacao_pedido;
            var tamanho_pagina = pedidos[i].detalhes_pedido[0].tamanho;
            var tipos_copia = pedidos[i].detalhes_pedido[0].tipo_copia;
            var tipos_capa = pedidos[i].detalhes_pedido[0].tipo_capa;
            var acabamento = pedidos[i].detalhes_pedido[0].acabamento;

            //Passando valores por parâmetro
            await verifyConstraints({req, centro_custos, curso, modo_envio, avaliacao_pedido, tamanho_pagina, tipos_copia, tipos_capa, acabamento});

            //PEDIDO
            pedidos[i].centro_custos = req.centro_custos;
            pedidos[i].curso = req.curso;
            pedidos[i].modo_envio = req.modo_envio;
            pedidos[i].avaliacao_pedido = req.avaliacao_pedido;

            //DETALHES DO PEDIDO
            pedidos[i].detalhes_pedido[0].tamanho = req.tamanho_pagina;
            pedidos[i].detalhes_pedido[0].tipo_copia = req.tipos_copia;
            pedidos[i].detalhes_pedido[0].tipo_capa = req.tipos_capa;
            pedidos[i].detalhes_pedido[0].acabamento = req.acabamento;
        }
        return res.json(pedidos);
    }
    else { return res.json({ error: "Pedido não encontrado!" }) }

}

module.exports = serializer;