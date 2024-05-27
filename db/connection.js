
const Sequelize = require('sequelize');//para fazer alterações no banco, utilizado em bancos relacionais com o node

const sequelize = new Sequelize({ // instancia do sequelize
    dialect: 'sqlite', //qual banco será utilizado 
    storage: './db/app.db' // onde está o banco
});

module.exports = sequelize  //exportar coisas que estão fora do app.js, essa conectio faz conecção com o banco de dados
