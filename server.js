const express = require('express');
const app = express();
const cors = require('cors');
const {sequelize, ...models} = require('./src/models/index.js');

app.use(cors());
app.use(express.json());

const {Users, Tables, UsersTables} = models;

const createTable = async (userId) => {
    const table = await Tables.create({title: 'New table'});
    await UsersTables.create({userId: userId, tableId: table.id, relation: 'OWNER'});
};


const getUserTables = async (userId) => {
    try {
        const tables = await Tables.findAll({
            include: {
                model: Users,
                where: {id: userId},
                through: {attributes: []}
            },
        });
        console.log('Список столов пользователя:', tables);
        return tables;
    } catch (error) {
        console.error('Ошибка при получении столов пользователя:', error);
    }
};

app.get('/api/users/:userId/tables', async (req, res) => {
    const userId = req.params.userId;
    try{
        const results = await getUserTables(userId);
        res.json(results);
    } catch (error) {
        console.error(error);
    }
})

app.post('/api/users/:userId/create-new-table', async (req, res) => {
    const userId = req.params.userId;
    await createTable(userId);
})

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});