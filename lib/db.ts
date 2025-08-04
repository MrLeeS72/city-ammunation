import { neon } from '@neondatabase/serverless';

// Инициализируем клиент Neon с URL базы данных из переменных окружения
// DATABASE_URL будет предоставлен Vercel при интеграции Neon
const sql = neon(process.env.DATABASE_URL!);

export default sql;
