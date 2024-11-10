const sequelize = require('../config/database');
const Users = require("./users");
const Tables = require("./tables");
const UsersTables = require("./users_tables");

const models = {
    Users: Users,
    Tables: Tables,
    UsersTables: UsersTables
};

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = { sequelize, ...models };