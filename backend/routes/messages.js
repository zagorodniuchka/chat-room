import express from 'express';
import  pool  from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { sender, content, is_read } = req.body;
    const result = await pool.query(
        'INSERT INTO messages (sender, content, is_read) VALUES ($1, $2, $3) RETURNING *',
        [sender, content, is_read ?? false]
    );
    res.json(result.rows[0]);
});

// READ ALL with pagination
router.get('/', async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await pool.query(
        'SELECT * FROM messages ORDER BY created_at LIMIT $1 OFFSET $2',
        [limit, offset]
    );

    res.json(result.rows);
});

// READ ONE by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);
    res.json(result.rows[0]);
});

// UPDATE — mark as read or update content
router.put('/:id', async (req, res) => {
    console.log('PUT запрос получен:', req.params, req.body); // Логируем параметры и тело
    try {
        const { id } = req.params;
        const { content, is_read } = req.body;

        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            console.log('Ошибка: ID не является числом:', id);
            return res.status(400).json({ error: 'ID must be a valid number' });
        }

        if (typeof is_read !== 'boolean' && is_read !== undefined) {
            console.log('Ошибка: is_read не boolean:', is_read);
            return res.status(400).json({ error: 'is_read must be a boolean' });
        }
        if (typeof content !== 'string' && content !== undefined) {
            console.log('Ошибка: content не строка:', content);
            return res.status(400).json({ error: 'content must be a string' });
        }

        const result = await pool.query(
            'UPDATE messages SET content = COALESCE($1, content), is_read = COALESCE($2, is_read) WHERE id = $3 RETURNING *',
            [content, is_read, parsedId]
        );

        console.log('Результат запроса:', result.rows, 'RowCount:', result.rowCount); // Логируем результат
        if (result.rowCount === 0) {
            console.log('Сообщение не найдено для id:', parsedId);
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка сервера:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
router.delete('/', async (req, res) => {
    const { id } = req.query;
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ message: `Message with id ${id} deleted.` });
});

export default router;
