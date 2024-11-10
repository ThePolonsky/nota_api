const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Notebooks = sequelize.define('notebooks', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Notebooks;