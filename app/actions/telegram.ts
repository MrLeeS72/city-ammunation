"use server"

import { formatOrderForTelegram, sendTelegramMessage } from "../utils/telegram"

interface OrderData {
  customerInfo: {
    firstName: string
    lastName: string
    phone: string
    idCard: string
    discordNickname: string
  }
  items: Array<{
    name: string
    category: string
    quantity: number
    price: number
    ammoQuantity?: number
    ammoPrice?: number
  }>
  totalPrice: number
  orderDate: string
}

export async function sendTelegramOrderAction(order: OrderData): Promise<{ success: boolean; error?: string }> {
  try {
    const message = formatOrderForTelegram(order)
    const result = await sendTelegramMessage(message)
    return result
  } catch (error: any) {
    console.error("Error in sendTelegramOrderAction:", error)
    return { success: false, error: error.message || "Failed to send order to Telegram." }
  }
}
