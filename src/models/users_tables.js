// models/users_tables.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsersTables = sequelize.define('users_tables', {
    relation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = UsersTables;