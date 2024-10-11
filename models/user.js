//models/user.js
const Sequelize = require('sequelize-oracle');

module.exports = (sequelize, DataType) => {
    return sequelize.define('USUARIOs', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre_usuario: { 
            type: Sequelize.STRING,
            allowNull: false,
            len: [6, 20]

        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
                len: [8, 20]
        },
        /*email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }*/
    }, {
        tableName: 'USUARIOs',
        underscored: true,
        paranoid: true
    });
}
