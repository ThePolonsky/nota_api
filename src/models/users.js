const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Users = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

Users.associate = (models) => {
    Users.belongsToMany(models.Tables, {
        through: 'users_tables',
        foreignKey: 'userId',
        otherKey: 'tableId',
    });
};

module.exports = Users;