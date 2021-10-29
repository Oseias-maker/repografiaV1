//Biblioteca do sequelize 
const Sequelize = require("sequelize");
//Operadores do sequelize
const Op = Sequelize.Op;

//Arquivos de config
const config = require("../.config/auth.config.json");

//Inicializando as models e as recebendo
const { initModels } = require("../models/init-models")
var { resettoken, usuario } = initModels(sequelize)

//Uitlizado para criptografar as senhas no banco de dados
const bcrypt = require("bcrypt")
//Usado para criar o token de reset aleatório
const crypto = require('crypto');


module.exports = {

  // ROTAS POST

  forgotPasswordPost: async (req, res, next) => {
    //Assegure que você tem um usuário com esse email

    // const { mail } = req.body;
    var mail = req.body.mail

    var email = await usuario.findOne({ where: { email: mail } });
    if (email == null) {
      /**
       * Nós não queremos avisar á atacantes
       * sobre emails que não existem, porque
       * dessa maneira, facilita achar os existentes.
       **/
      return res.json({ status: 'ok' });
    }
    /**
     * Expira todos os tokens que foram definidos 
     * anteriormente para este usuário. Isso preveni
     * que tokens antigas sejam usadas.
     **/
    await resettoken.update({
      used: 1
    },
      {
        where: {
          email: mail
        }
      });

    //Cria um resete de token aleatório
    req.token = crypto.randomBytes(64).toString('base64');

    //token expira depois de uma hora
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1 / 24);

    //Inserindo dados da token dentro do BD
    await resettoken.create({
      email: mail,
      expiration: expireDate,
      token: req.token,
      used: 0
    });
    next();
    return res.json({ status: 'ok' });
  },



  //RESET PASSWORD 

  resetPassword: async (req, res, next) => {

    let { email, token, senha, senha2 } = req.body;

    //comparar senhas
    if (senha !== senha2) {
      return res.json({ status: 'error', message: 'Senha não encontrada. Por favor, tente novamente.' });
    }

    /**
    * Assegure que sua senha é válida (isValidPassword
    * function checa se sua senha tem >= 8 caracteres, alfanumerico,
    * caracter especial, etc)
    **/
    // if (!isValidPassword(req.body.password1)) {
    //   return res.json({ status: 'error', message: 'Senha não contêm os requerimentos minímos. Por favor, tente novamente.' });
    // }

    var record = await resettoken.findOne({
      where: {
        email: email,
        expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
        token: token,
        used: 0
      }
    });

    if (record == null) {
      return res.json({ status: 'error', message: 'Token não encontrado. Por favor, faça o processo de resetar a senha novamente.' });
    }

    await resettoken.update({
      used: 1
    },
      {
        where: {
          email: email
        }
      });

    const newPassword = await bcrypt.hash(senha, config.jwt.saltRounds);

    await usuario.update({
      senha: newPassword,
    },
      {
        where: {
          email: email
        }
      });

    return res.json({ status: 'ok', message: 'Senha resetada. Por favor, tente efetuar o login com sua nova senha' });
  },
}