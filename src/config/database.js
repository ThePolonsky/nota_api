const { Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', '0800', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных успешно установлено.');
    } catch (error) {
        console.error('Невозможно установить соединение с базой данных:', error);
    }
};

testConnection();

module.exports = sequelize;