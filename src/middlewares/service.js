const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { initModels } = require("../models/init-models");
var { servico } = initModels(sequelize);

const verifyService = async (req, res, next) => {
    req.servicos = [];
    req.sub_total = 0;

    //Lógica para sub_total - Switch  
    var { tipos_copia, tamanho_pagina, tipos_capa, acabamento, num_paginas, num_copias } = req.body;

    //Correlacionando a tabela de Serviços com as tabelas tipos_copia e tamanho_pagina
    switch (tipos_copia && tamanho_pagina) {
        case '1' && '3':
            req.servicos.push(1);
            break;

        case '1' && '2':
            req.servicos.push(2);
            break;

        case '1' && '1':
            req.servicos.push(3);
            break;

        case '2' && '2':
            req.servicos.push(4);
            break;

        case '1' && '4':
            req.servicos.push(5);
            break;


        case '1' && '5':
            req.servicos.push(5);
            break;

        default:
            null
            break;
    };

    //Correlacionando a tabela de Serviços com as tabelas tipos_capa e acabamento
    switch (tipos_capa && acabamento) {
        case '1' && '3':
            req.servicos.push(6);
            break;

        case '1' && '2':
            req.servicos.push(7);
            break;

        case '1' && '1':
            req.servicos.push(8);
            break;

        case '2' && '2':
            req.servicos.push(9);
            break;

        default:
            null
            break;
    };

    //Procurando um serviço dependendo de como ficou nossa array.
    //req.serviços pode ficar assim, por exemplo: [1,6]
    const serv = await servico.findAll(
        {
            where: {
                id_servico: {
                    [Op.or]: req.servicos
                }
            },
        }
    );

    var folhasImpressas = num_paginas * num_copias

    //Percorrendo os dois serviços passados, para podermos utilizar as quantidades separadamente
    // e somar o total com os dois valores unitários
    for (let i = 0; i < serv.length; i++) {
        req.sub_total += parseFloat(serv[i].valor_unitario);
        //Aqui onde ele encontrar o primeiro serviço esgotado, ele para. 
        //Portanto, mais uma regra de negócio:
        //É preciso de dois serviços para realizar um pedido, não estando nenhum dos dois esgotados.
        if (serv[i].quantidade <= 0) {
            return res.json({ error: `O serviço ${serv[i].descricao} está esgotado!` });
        }
        if (serv[i].quantidade < folhasImpressas) {
            return res.json({ error: `O serviço ${serv[i].descricao} não contém quantidade o suficiente para essa solicitação!` })
        }
    }
    next();
    return;
}

module.exports = verifyService;
