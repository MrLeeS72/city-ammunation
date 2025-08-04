import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "@/lib/env" // Импортируем из lib/env

interface TelegramOrderData {
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

export async function sendTelegramMessage(message: string): Promise<{ success: boolean; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram bot token or chat ID is not set.")
    return { success: false, error: "Telegram bot token or chat ID is not set." }
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  const params = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "HTML",
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Failed to send Telegram message:", data)
      return { success: false, error: data.description || "Unknown Telegram API error" }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error sending Telegram message:", error)
    return { success: false, error: error.message || "Network error" }
  }
}

export function formatOrderForTelegram(order: TelegramOrderData): string {
  let message = `<b>Новый заказ в City Ammu-Nation!</b>\n\n`

  message += `<b>Информация о покупателе:</b>\n`
  message += `Имя: ${order.customerInfo.firstName} ${order.customerInfo.lastName}\n`
  message += `Телефон: ${order.customerInfo.phone}\n`
  message += `ID Карта: ${order.customerInfo.idCard}\n`
  message += `Discord: ${order.customerInfo.discordNickname}\n\n`

  message += `<b>Детали заказа:</b>\n`
  order.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    const ammoTotal = (item.ammoQuantity || 0) * (item.ammoPrice || 0)
    const totalItemPrice = itemTotal + ammoTotal

    message += `${index + 1}. ${item.name} (x${item.quantity}) - $${itemTotal.toLocaleString()}\n`
    if (item.ammoQuantity && item.ammoQuantity > 0) {
      message += `   + Патроны (x${item.ammoQuantity} пачек) - $${ammoTotal.toLocaleString()}\n`
    }
    message += `   Итого за позицию: $${totalItemPrice.toLocaleString()}\n`
  })

  message += `\n<b>Общая сумма заказа: $${order.totalPrice.toLocaleString()}</b>\n`
  message += `Дата заказа: ${order.orderDate}\n`

  return message
}
