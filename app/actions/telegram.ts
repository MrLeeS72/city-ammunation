"use server"

import { sendOrderToTelegram } from "@/app/utils/telegram"
import type { CartItem } from "@/app/contexts/CartContext"

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

export async function sendTelegramOrderAction(orderData: OrderData): Promise<{ success: boolean; error?: string }> {
  return sendOrderToTelegram(orderData)
}
