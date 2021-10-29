const nodemailer = require('nodemailer');
const mailer = require('../.config/mailer.config');
const { pedidoEmail } = require("../views/emailTemplates")
const { forgotPasswordEmail } = require("../views/emailTemplates")
const { avaliacaoEmail } = require("../views/emailTemplates")
const { unlink } = require("fs")

//Criando conexão SMTP
var mailConfig = {
    secureConnection: mailer.hotmail.secureConnection,
    service: mailer.hotmail.service,
    auth: {
        user: mailer.hotmail.auth.user,
        pass: mailer.hotmail.auth.pass
    },
    tls: {
        ciphers: mailer.hotmail.tls.ciphers
    }
};

var transport = nodemailer.createTransport(mailConfig)

exports.EnviaEmail = async (req) => {

    if (req.avaliacao_obs) {
        const { id, titulo_pedido, nif, avaliacao_pedido, avaliacao_obs } = req;

        var output = avaliacaoEmail({id, titulo_pedido, nif, avaliacao_obs, avaliacao_pedido})
        var email = mailer.reproEmail;
        var title = `Avaliação da Reprografia Nº${id}`;
        var attachments = null;
    }

    if (req.token) {
        const { mail } = req.body
        const token = req.token
        var output = forgotPasswordEmail(token, mail)
        var email = mail;
        var title = "Recuperação de Senha";
        var attachments = null;
    }

    if(req.body.num_copias) {
        const { titulo_pedido, observacoes, num_copias, num_paginas } = req.body;
        const { id, centro_custos, modo_envio, acabamento, tamanho_pagina, tipos_capa, curso, tipos_copia } = req;
        const nif = req.user.nif;

        //Parâmetros que serão passados para nossa view de e-mail
        var output = pedidoEmail({id, titulo_pedido, nif, centro_custos, curso, tipos_copia,
            tamanho_pagina, tipos_capa, acabamento, num_paginas, num_copias, modo_envio, observacoes})

        var email = mailer.reproEmail;
        var title = `Solicitação de Reprografia Nº${id}`;

        if (req.file) {
            attachments = [
                {
                    filename: req.file.filename,
                    path: req.file.path
                }
            ]
            //Exclui o Anexo que foi feito upload pelo multer para ser enviado pelo mailer 
            //depois de 5seg
            setTimeout(async () => {
                await unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log(`successfully deleted ${req.file.path}`);
                });

            }, 5000)
        }
        else { var attachments = null }
    }

    var message = {
        from: mailer.hotmail.auth.user,
        to: email,
        replyTo: process.env.REPLYTO_ADDRESS,
        subject: title,
        html: output,
        attachments: attachments,
        date: Date.now()
    }

    //Envia o email
    await transport.sendMail(message, function (err, info) {
        if (err) { console.log(err) }
        else { console.log(info); }
    });

};