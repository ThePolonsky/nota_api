const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

async function readFile(filePath) {
	try {
		const fileContent = await fs.readFile(filePath, 'utf8');
		return fileContent;
	} catch (error) {
		console.error('Ошибка при чтении файла:', error);
		throw error;
	}
}

async function createEmptyFile(fileName) {
	try {
		const filePath = path.join(__dirname, '..', 'public', 'notes', fileName);
		await fs.writeFile(filePath, '');
		console.log(`Файл ${fileName} успешно создан`);
	} catch (error) {
		console.error('Ошибка при создании файла:', error);
		throw error;
	}
}

app.post('/api/notes', async (req, res) => {
	try {
		const { fileName } = req.body;
		if (!fileName || !fileName.endsWith('.html')) {
			return res.status(400).json({ error: 'Неверное имя файла. Файл должен иметь расширение .html' });
		}

		await createEmptyFile(fileName);
		res.status(201).json({ message: 'Файл успешно создан' });
	} catch (error) {
		console.error('Ошибка при создании файла:', error);
		res.status(500).json({ error: 'Ошибка при создании файла' });
	}
});

// API endpoint для получения списка файлов
app.get('/api/notes', async (req, res) => {
	try {
		const notesPath = path.join(__dirname, '..', 'public', 'notes');
		const files = await fs.readdir(notesPath);
		res.json(files.filter(i => i.includes('.html')).map(item => item.replace('.html', '')));
	} catch (error) {
		console.error('Ошибка при получении списка заметок:', error);
		res.status(500).json({ error: 'Ошибка при получении списка заметок' });
	}
});

app.get('/api/notes/:filename', async (req, res) => {
	try {
		const filename = req.params.filename;
		const notesPath = path.join(__dirname, '..', 'public', 'notes', filename);
		const fileContent = await readFile(notesPath);
		res.send(fileContent);
	} catch (error) {
		console.error('Ошибка при чтении файла:', error);
		res.status(404).json({ error: 'Файл не найден' });
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
