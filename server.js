const express = require('express');
const app = express();
const cors = require('cors');
const {Pool} = require('pg');
const result = require("pg/lib/query");

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '0800',
    port: 5432,
});

//e|---------Столы---------|

//q|---Получение списка столов по ID пользователя---|

app.get('/api/tables/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // const results = await pool.query(`SELECT * FROM users_tables_pivot WHERE user_id = $1`, [userId]);
        const results = await pool.query(`WITH user_tables AS (
              SELECT DISTINCT table_id
              FROM users_tables_pivot
              WHERE user_id = ${userId}
            ),
            table_info AS (
              SELECT t.id, t.title, t.created_at
              FROM tables t
              INNER JOIN user_tables ut ON t.id = ut.table_id
            )
            SELECT 
              ti.id,
              ti.title,
              ti.created_at
            FROM table_info ti
            ORDER BY ti.id;
        `);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error fetching tables'});
    }
});

//q|---Добавление нового стола---|

const createTable = async (title, userId, res) => {
    try {
        const addResults = await pool.query(`INSERT INTO tables (title, created_at) VALUES ($1, NOW()) RETURNING *`, [title]);
        const tableId = addResults.rows[0].id;
        const pivotResults = await pool.query(`INSERT INTO users_tables_pivot (user_id, table_id, relation) VALUES ($1, $2, $3) RETURNING *`, [userId, tableId, 'ADMIN']);
        res.json(addResults.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error creating table'});
    }
};

const createUserTablePivot = async (userId, tableId, res) => {
    try {
        const results = await pool.query(`INSERT INTO users_tables_pivot (user_id, table_id, relation) VALUES ($1, $2, $3) RETURNING *`, [userId, tableId, 'ADMIN']);
        res.json(results.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error creating pivot'});
    }
};

app.post('/api/tables', async (req, res) => {
    const {title, userId} = req.body;
    const tableId = await createTable(title, userId, res);
});

//q|---Удаление блокнота по ID---|

app.delete('/api/notebooks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const results = await pool.query('DELETE FROM notebooks WHERE id = $1', [id]);
        if (results.rowCount === 0) {
            return res.status(404).json({message: 'Notebook not found'});
        }
        res.status(204).send({message: 'Notebook deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error deleting notebook'});
    }
});

//q|---Создание нового блокнота---|

app.post('/api/notebooks', async (req, res) => {
    const {title, userId} = req.body;
    try {
        const results = await pool.query(`INSERT INTO notebooks (title, user_id, created_at) VALUES ($1, $2, NOW()) RETURNING *`, [title, userId]);
        res.json(results.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error creating notebook'});
    }
});

//q|---Получение списка блокнотов по ID пользователя---|

app.get('/api/notebooks/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const results = await pool.query(`SELECT * FROM notebooks WHERE user_id = $1`, [userId]);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error fetching notebooks'});
    }
});



//q|---Получение списка заметок по ID блокнота---|

app.get('/api/notes/:notebookId', async (req, res) => {
    const notebookId = req.params.notebookId;
    try {
        const results = await pool.query(`SELECT * FROM notes WHERE notebook_id = $1`, [notebookId]);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error fetching notes'});
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
