README на русском языке - [RU](https://github.com/ThePolonsky/nota_front/tree/main?tab=readme-ov-file#nota-клиентская-часть)

# Nota Backend

This repository contains the backend part of the Nota project, built with Node.js and Express. The backend is responsible for handling requests, managing data, and interacting with the database.

## Technologies Used
- Node.js
- Express.js
- REST API
- PostgreSQL

## Installation and Setup
1. Clone the repository:
  ```bash
  git clone https://github.com/username/nota-backend.git
  ```

2.	Navigate to the project folder:
  ```bash
  cd nota-backend
  ```

3. Install dependencies:
  ```bash
  npm install
  ```

4. Create PostgreSQL database
   
5. Configure database connection:
+ Open /src/config/database.js file
+ Input params of the database. Example:
  ```bash
  const port = 5432;
  const username = 'postgres';
  const password = '0000';
  ```

6. Start the server:
  ```bash
  npm run start
  ```

Related Repositories:
[Nota Frontend](https://github.com/ThePolonsky/nota_front)

---------------

# Nota Серверная часть

Этот репозиторий содержит серверную часть проекта Nota, разработанную с использованием Node.js и Express. Бэкенд отвечает за обработку запросов, управление данными и взаимодействие с базой данных.

## Используемые технологии
- Node.js
- Express.js
- REST API
- PostgreSQL

## Установка и настройка
1. Клонируйте репозиторий:
  ```bash
  git clone https://github.com/username/nota-backend.git
  ```

2. Перейдите в папку проекта:
  ```bash
  cd nota-backend
  ```

3. Установите зависимости:
  ```bash
  npm install
  ```

4. Создайте базу данных PostgreSQL.
   
5. Настройте подключение к базе данных:
+ Откройте файл /src/config/database.js.
+ Укажите параметры базы данных. Пример:
  ```bash
  const port = 5432;
  const username = 'postgres';
  const password = '0000';
  ```

6. Запустите сервер:
  ```bash
  npm run start
  ```

Связанные репозитории: 
[Nota Frontend](https://github.com/ThePolonsky/nota_front)
