"use server"

import sql from "@/lib/db"

/**
 * Проверяет подключение к базе данных, выполняя простой запрос.
 * @returns Объект с результатом проверки (успех/ошибка) и сообщением.
 */
export async function testDbConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Выполняем простой запрос для проверки подключения
    const result = await sql`SELECT NOW() as current_time`
    const currentTime = result[0]?.current_time || "Неизвестное время"
    return { success: true, message: `Подключение к базе данных успешно! Текущее время БД: ${currentTime}` }
  } catch (error) {
    console.error("Ошибка при проверке подключения к БД:", error)
    return {
      success: false,
      message: `Ошибка подключения к базе данных: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
