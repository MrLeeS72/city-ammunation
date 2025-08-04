import { neon } from "@neondatabase/serverless"

// Добавляем явную проверку переменной окружения
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please ensure it is configured in your .env.local file for local development or in Vercel environment variables for deployment.",
  )
}

const sql = neon(databaseUrl)

export default sql
