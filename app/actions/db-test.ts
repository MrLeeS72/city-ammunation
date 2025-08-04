"use server"

import { supabaseServer } from "@/lib/db" // Импортируем серверный клиент Supabase

export async function testDbConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Выполняем простой запрос для проверки подключения
    // Например, выбираем одну запись из таблицы profiles
    const { data, error } = await supabaseServer.from("profiles").select("id").limit(1)

    if (error) {
      console.error("Supabase DB connection test failed:", error)
      return { success: false, message: `Ошибка подключения к базе данных Supabase: ${error.message}` }
    }

    return {
      success: true,
      message: `Подключение к базе данных Supabase успешно! Время сервера: ${new Date().toLocaleString()}`,
    }
  } catch (error: any) {
    console.error("Непредвиденная ошибка при проверке подключения к БД:", error)
    return {
      success: false,
      message: `Непредвиденная ошибка при проверке подключения к базе данных: ${error.message || "Неизвестная ошибка"}`,
    }
  }
}
