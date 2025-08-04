"use server"

import sql from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { CartItem } from "@/app/contexts/CartContext" // Импортируем тип CartItem

interface OrderData {
  customerInfo: {
    firstName: string
    lastName: string
    phone: string
    idCard: string
    discordNickname: string
  }
  items: CartItem[]
  totalPrice: number
  orderDate: string
}

interface StoredOrder {
  id: string
  userId: string
  orderDate: string
  totalPrice: number
  itemsJson: CartItem[]
  createdAt: string
}

/**
 * Добавляет новый заказ в базу данных.
 */
export async function addOrder(userId: string, order: OrderData): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      INSERT INTO orders (user_id, order_date, total_price, items_json)
      VALUES (
        ${userId},
        ${order.orderDate},
        ${order.totalPrice},
        ${JSON.stringify(order.items)}::jsonb
      )
    `
    revalidatePath("/profile") // Перевалидируем страницу профиля, чтобы обновить историю заказов
    return { success: true }
  } catch (error) {
    console.error("Ошибка при добавлении заказа:", error)
    return { success: false, error: "Не удалось добавить заказ." }
  }
}

/**
 * Получает историю заказов для конкретного пользователя.
 */
export async function getOrders(userId: string): Promise<StoredOrder[]> {
  try {
    const orders = await sql<StoredOrder[]>`
      SELECT id, user_id as "userId", order_date as "orderDate", total_price as "totalPrice", items_json as "itemsJson", created_at as "createdAt"
      FROM orders
      WHERE user_id = ${userId}
      ORDER BY order_date DESC
    `
    return orders
  } catch (error) {
    console.error("Ошибка при получении истории заказов:", error)
    return []
  }
}
