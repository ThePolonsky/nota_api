const express = require('express');
const app = express();
const cors = require('cors');
const {Sequelize, DataTypes, QueryInterface} = require('sequelize');

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('postgres', 'postgres', '0800', {
    host: 'localhost',
    dialect: 'postgres'
});

// Инициализируем соединение
async function init() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

init();

// Определяем модели

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.CHAR(24),
        allowNull: false
    },
    email: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

const Tables = sequelize.define('Tables', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.CHAR(24),
        allowNull: false,
        defaultValue: 'New Table'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

const Notebooks = sequelize.define('Notebooks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.CHAR(24),
        allowNull: false,
        defaultValue: 'New Notebook'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

const Notes = sequelize.define('Notes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.CHAR(24),
        allowNull: false,
        defaultValue: 'New note'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    content: DataTypes.TEXT
})

const Users_Tables_Pivot = sequelize.define('Users_Tables_Pivot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    table_id: {
        type: DataTypes.INTEGER
    },
    relation: DataTypes.CHAR(20),
    tableName: 'Users_Tables_Pivot'
});

Users.hasMany(Tables, { onDelete: 'cascade' });
Tables.belongsTo(Users);

Users.belongsToMany(Tables, { through: Users_Tables_Pivot });
Tables.belongsToMany(Users, { through: Users_Tables_Pivot });

Users_Tables_Pivot.belongsTo(Users);
Users_Tables_Pivot.belongsTo(Tables);

// Users_Tables_Pivot.addIndex(['userId']);
// Users_Tables_Pivot.addIndex(['tableId']);

QueryInterface.addIndex('Users_Tables_Pivot', DataTypes.INTEGER, ['userId']);
QueryInterface.addIndex('Users_Tables_Pivot', DataTypes.INTEGER, ['tableId']);

QueryInterface.addConstraint('Users_Tables_Pivot', {
    type: 'foreign key',
    references: {
        table: 'Users',
        field: 'id'
    },
    fields: ['userId']
});

QueryInterface.addConstraint('Users_Tables_Pivot', {
    type: 'foreign key',
    references: {
        table: 'Tables',
        field: 'id'
    },
    fields: ['tableId']
});

