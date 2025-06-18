import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

// Проверка переменных окружения
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`🚨 Missing required environment variable: ${key}`);
    }
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL!');
        client.release();
    } catch (err) {
        console.error('❌ Failed to connect to PostgreSQL:', err.message);
        process.exit(1); // Жёсткий выход
    }
})();

export default pool;
