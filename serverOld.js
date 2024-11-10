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

//q|---Создание нового стола---|

const createTable = async (userId, res) => {
    const title = 'New Table';
    try {
        const addResults = await pool.query(`INSERT INTO tables (title, created_at) VALUES ($1, NOW()) RETURNING *`, [title]);
        const tableId = addResults.rows[0].id;
        await pool.query(`INSERT INTO users_tables_pivot (user_id, table_id, relation) VALUES ($1, $2, $3) RETURNING *`, [userId, tableId, 'ADMIN']);
        res.json(addResults.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error creating table'});
    }
};

app.post('/api/tables', async (req, res) => {
    const {userId} = req.body;
    await createTable(userId, res);
});

//q|---Удаление стола---|

const deleteTable = async (userId, tableId, res) => {
    try {
        const pivotResults = await pool.query('DELETE FROM users_tables_pivot WHERE table_id = $1', [tableId]);
        if (pivotResults.rowCount === 0) {
            return res.status(404).json({message: 'Pivot not found'});
        }
        const tableResults = await pool.query('DELETE FROM tables WHERE id = $1', [tableId]);
        if (tableResults.rowCount === 0) {
            return res.status(404).json({message: 'Table not found'});
        }
        res.status(204).send({message: 'Table deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error deleting table'});
    }
}

const deleteNotebooksOfTable = async (userId, tableId, res) => {
    try {
        const pivotResults = await pool.query(`DELETE FROM notebooks
            WHERE id IN (
            SELECT notebook_id
            FROM tables_notebooks_pivot
            WHERE table_id = $1
            );
            DELETE FROM tables_notebooks_pivot
            WHERE table_id = $1`, [tableId]);
        if (pivotResults.rowCount === 0) {
            return res.status(404).json({message: 'Pivot not found'});
        }
        const notebookResults = await pool.query('DELETE FROM notebooks WHERE id = $1', [tableId]);
        if (notebookResults.rowCount === 0) {
            return res.status(404).json({message: 'Table not found'});
        }
        res.status(204).send({message: 'Table deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error deleting table'});
    }
}

app.delete('/api/delete-table', async (req, res) => {
    const tableId = parseInt(req.params.tableId);
    const userId = parseInt(req.params.userId);
    try {
        await deleteNotebooksOfTable(userId, tableId, res);
        await deleteTable(userId, tableId, res);
    } catch (err) {
        console.error(err);
    }
});

//q|---Изменение названия стола---|

app.put('/api/update-table-title', async (req, res) => {
    const {tableId, newTitle} = req.body;
    try {
        await pool.query('UPDATE tables SET title = $1 WHERE id = $2', [newTitle, tableId]);
        res.status(200).json({ success: true, message: 'Table title updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error creating notebook'});
    }
});



//e|---------Блокноты---------|



//q|---Создание нового блокнота---|

const createNotebook = async ( userId, tableId, res) => {
    const title = 'New Notebook';
    try {
        const addResults = await pool.query(`INSERT INTO notebooks (title, created_at) VALUES ($1, NOW()) RETURNING *`, [title]);
        const notebookId = addResults.rows[0].id;
        await pool.query(`INSERT INTO users_notebooks_pivot (user_id, notebook_id, relation) VALUES ($1, $2, $3) RETURNING *`, [userId, notebookId, 'ADMIN']);
        await pool.query(`INSERT INTO tables_notebooks_pivot (table_id, notebook_id) VALUES ($1, $2) RETURNING *`, [tableId, notebookId]);
        res.json(addResults.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error creating table'});
    }
};

app.post('/api/notebooks', async (req, res) => {
    const { userId, tableId } = req.body;
    await createNotebook(userId, tableId, res);
});

//q|---Получение списка блокнотов по ID пользователя---|

app.get('/api/notebooks/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const results = await pool.query(`WITH user_notebooks AS (
              SELECT DISTINCT notebook_id
              FROM users_notebooks_pivot
              WHERE user_id = ${userId}
            ),
            notebook_info AS (
              SELECT n.id, n.title, n.created_at
              FROM notebooks n
              INNER JOIN user_notebooks un ON n.id = un.notebook_id
            )
			SELECT ni.*, tnp.table_id
			FROM notebook_info ni
			LEFT JOIN tables_notebooks_pivot tnp ON tnp.notebook_id = ni.id
			ORDER BY ni.id
        `);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error fetching tables'});
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
