//Biblioteca do sequelize 
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
//Operadores do sequelize
const Op = Sequelize.Op;
//Arquivo de config
const config = require("../.config/auth.config.json");

//Inicializando as models e as recebendo
const { initModels } = require("../models/init-models")
var { usuario, tipo_usuario } = initModels(sequelize)

//Usado para criptografar as senhas no banco -> Nesse caso para comparar a senha 
//quando o usuário solicitar mudança de senha.
const bcrypt = require("bcrypt");

//Usado para enviar o token e informações do usuário pro front quando ele Logar
const { sign } = require("jsonwebtoken");
const { unlink } = require("fs")

//Funções do usuário 
module.exports = {

    //Usuários 

    logar: async (req, res) => {

        const { emailOrNif, senha } = req.body;

        if (!emailOrNif || !senha) {
            return res.status(400).send(
                'Requisição faltando campos de email ou senha!'
            );
        }

        var user = await usuario.findOne({
            where: {
                email: emailOrNif
            }
        })
        //Login com usuário ou NIF
        if (user == null) {
            user = await usuario.findOne({
                where: {
                    nif: emailOrNif
                }
            })

            if (!user) {
                return res.json({ status: 'error', error: "E-mail ou Senha Inválidos!" })
            }
        }

        bcrypt.compare(senha, user.senha).then((match) => {
            if (!match) {
                return res.json({
                    accessToken: null,
                    error: "E-mail ou Senha Inválidos!"
                });
            };

            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push(roles[i].id + "_ROLE_" + roles[i].descricao.toUpperCase());
                }

                var token = sign({ nif: user.nif, nome: user.nome, email: user.email, imagem: user.imagem, roles: authorities, }, config.jwt.secret, {
                    expiresIn: 86400 // 24 hours
                });

                res.status(200).json({
                    nif: user.nif,
                    nome: user.nome,
                    email: user.email,
                    imagem: user.imagem,
                    roles: authorities,
                    accessToken: token
                });
            });
        })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    },

    informacoesBasicas: async (req, res) => {
        const user = await usuario.findByPk(req.user.nif, {
            include: [
                'roles'
            ],
            attributes: { exclude: ["senha"] }
        });

        res.json(user);
    },

    //Altera 
    alterarUsuario: async (req, res) => {
        await usuario.sequelize.query("SET FOREIGN_KEY_CHECKS=0;")

        var user = await usuario.findByPk(req.user.nif)

        let { nome, telefone, email, imagem } = req.body;

        if (req.file) {
            if (user.imagem !== config.adminAccount.defaultImage) {
                await unlink(user.imagem, (err) => {
                    if (err) throw err;
                    console.log(`successfully deleted ${user.imagem}`);
                });
            }
            imagem = req.file.path;
        }

        await user.update({ nome, telefone, email, imagem });

        res.status(200).json({ message: `Sua conta foi atualizada com sucesso!!` });
    },

    //Usuário pode excluir a própria conta (exclui pelo nif do usuário logado)
    excluirUsuario: async (req, res) => {
        await usuario.sequelize.query("SET FOREIGN_KEY_CHECKS=0;")

        const user = await usuario.findByPk(req.user.nif)

        await user.destroy();

        if (user.imagem !== config.adminAccount.defaultImage) {
            await unlink(user.imagem, (err) => {
                if (err) throw err;
                console.log(`successfully deleted ${user.imagem}`);
            });
        }

        res.status(200).json({ message: `Sua conta foi excluida com sucesso!!` });
    },

    mudarSenha: async (req, res) => {
        const { senhaAntiga, senhaNova } = req.body;

        await usuario.findOne({
            where: {
                nif: req.user.nif
            },
        }).then(user => {
            bcrypt.compare(senhaAntiga, user.senha).then((match) => {
                if (!match) return res.json({ error: "Senha inserida está incorreta" });

                bcrypt.hash(senhaNova, 10, function (err, hash) {
                    if (err) throw (err);
                    usuario.update(
                        { senha: hash },
                        { where: { nif: req.user.nif } }
                    );
                    res.json({ message: "Sua senha foi atualizada com sucesso!!" });
                });
            });
        });
    },

    //Gerentes --- (ADMIN)

    //Registrar usuário
    adicionarUsuario: (req, res) => {
        let { nif, senha, nome, telefone, depto, email, cfp, imagem, admin } = req.body;

        //Imagem padrão caso não seja inserida nenhuma imagem.
        imagem = config.adminAccount.defaultImage;

        if (req.file) {
            imagem = req.file.path;
        }

        //Regra de negócio para Controle de Usuário -> Se Input de Roles for 1 (usuário for ADM)
        //Ele faz a busca de admin na tabela roles, e registra o id de Admin no usuário a ser criado 
        //na tabela user_roles
        if (admin == 1) {
            admin = ["admin"]
        }
        else if (admin == 2) {
            admin = ["moderator"]
        }
        else {
            admin = ["user"]
        }

        bcrypt.hash(senha, config.jwt.saltRounds, function (err, hash) {
            if (err) throw (err);
            usuario.create({
                nif: nif,
                senha: hash,
                nome: nome,
                telefone: telefone,
                id_depto: depto,
                email: email,
                cfp: cfp,
                imagem: imagem
            })
                .then(user => {
                    if (admin) {
                        tipo_usuario.findAll({
                            where: {
                                descricao: {
                                    [Op.or]: admin
                                }
                            }
                        })
                            .then(roles => {
                                user.setRoles(roles)
                                // .then(roles => {
                                // res.status(200).send("User was registered successfully!");
                                // });

                            });
                    }
                    else {
                        // user role = 1
                        user.setRoles([1])
                        // .then(roles => {
                        // res.status(200).send({ message: "User was registered successfully!" });
                        // });
                    }
                    res.status(200).json({ message: `Usuário com nif ${nif} criado com sucesso!` });
                })
                .catch(err => {
                    res.status(500).json({ message: err.message });
                });
        })
    },

    buscarTodos: async (req, res) => {
        let usuarios = await usuario.findAll({
            include: [
                'roles'
            ]
        })
        res.json(usuarios)
    },

    buscarPorNome: async (req, res) => {
        const user = req.params.user;
        // const query = `%${req.query.search}`;
        let usuarios = await usuario.findAll({
            where: {
                nome: {
                    [Op.like]: `${user}%`
                }
            },
            include: [
                'roles'
            ],
            attributes: { exclude: ["senha"] }
        })
        res.json(usuarios)
    },

    buscarPorNif: async (req, res) => {
        const user = await usuario.findByPk(req.params.nif)

        if (user == null) {
            return res.json({ message: "Não Há nenhum usuário com esse NIF" })
        }

        res.json(user)
    },

    alterarPorNif: async (req, res) => {
        var user = await usuario.findByPk(req.params.nif)

        if (user == null) {
            return res.json({ message: "Não Há nenhum usuário com esse NIF" })
        }

        let { nif, nome, senha, telefone, depto, email, cfp, admin, imagem } = req.body;

        if (admin) {

            if (admin == 1) {
                admin = ["admin"]
            }
            else if (admin == 2) {
                admin = ["moderator"]
            }
            else {
                admin = ["user"]
            }

            tipo_usuario.findAll({
                where: {
                    descricao: {
                        [Op.or]: admin
                    }
                }
            }).then(roles => {
                user.updateRoles(roles)
            })
        }

        if (req.file) {
            if (user.imagem !== config.adminAccount.defaultImage) {
                await unlink(user.imagem, (err) => {
                    if (err) throw err;
                    console.log(`successfully deleted ${user.imagem}`);
                });
            }
            imagem = req.file.path;
        }

        bcrypt.hash(senha, 10, function (err, hash) {
            if (err) throw (err);
            user.update({ nif, nome, senha: hash, telefone, depto, email, cfp, imagem })

            res.status(200).json({ message: `Conta com NIF ${req.params.nif} atualizada com sucesso!!` });
        });
    },

    excluirPorNif: async (req, res) => {
        await usuario.sequelize.query("SET FOREIGN_KEY_CHECKS=0;")

        const user = await usuario.findByPk(req.params.nif)

        if (user == null) {
            return res.json({ message: "Não Há nenhum usuário com esse NIF" })
        }

        await user.destroy();

        if (user.imagem !== config.adminAccount.defaultImage) {
            await unlink(user.imagem, (err) => {
                if (err) throw err;
                console.log(`successfully deleted ${user.imagem}`);
            });
        }

        res.status(200).json({ message: `Conta com NIF ${req.params.nif} excluida com sucesso!!` });
    }
}