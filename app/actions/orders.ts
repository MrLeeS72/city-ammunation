"use server"

import { supabaseServer } from "@/lib/db" // Импортируем серверный клиент Supabase
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
    const { data, error } = await supabaseServer
      .from("orders")
      .insert({
        user_id: userId,
        order_date: order.orderDate,
        total_price: order.totalPrice,
        items_json: order.items, // Supabase автоматически преобразует JSONB
      })
      .select() // Возвращаем вставленные данные

    if (error) {
      console.error("Ошибка Supabase при добавлении заказа:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/profile") // Перевалидируем страницу профиля, чтобы обновить историю заказов
    return { success: true }
  } catch (error) {
    console.error("Непредвиденная ошибка при добавлении заказа:", error)
    return { success: false, error: "Не удалось добавить заказ." }
  }
}

/**
 * Получает историю заказов для конкретного пользователя.
 */
export async function getOrders(userId: string): Promise<StoredOrder[]> {
  try {
    const { data, error } = await supabaseServer
      .from("orders")
      .select("id, user_id, order_date, total_price, items_json, created_at")
      .eq("user_id", userId)
      .order("order_date", { ascending: false })

    if (error) {
      console.error("Ошибка Supabase при получении истории заказов:", error)
      return []
    }

    // Преобразуем данные к нужному формату
    const orders: StoredOrder[] = data.map((order: any) => ({
      id: order.id,
      userId: order.user_id,
      orderDate: order.order_date,
      totalPrice: order.total_price,
      itemsJson: order.items_json,
      createdAt: order.created_at,
    }))

    return orders
  } catch (error) {
    console.error("Непредвиденная ошибка при получении истории заказов:", error)
    return []
  }
}
