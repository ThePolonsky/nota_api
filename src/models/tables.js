const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Tables = sequelize.define('tables', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

Tables.associate = (models) => {
    Tables.belongsToMany(models.Users, {
        through: 'users_tables',
        foreignKey: 'tableId',
        otherKey: 'userId',
    });
};

module.exports = Tables;