import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "@/lib/constants"

export async function sendTelegramMessage(message: string): Promise<{ success: boolean; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram bot token or chat ID is not configured.")
    return { success: false, error: "Telegram bot token or chat ID is not configured." }
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  const params = new URLSearchParams({
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "HTML",
  })

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Telegram API error:", data)
      return { success: false, error: data.description || "Failed to send message to Telegram." }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error sending message to Telegram:", error)
    return { success: false, error: error.message || "Network error." }
  }
}

export function formatOrderForTelegram(order: any): string {
  const customerInfo = `
<b>Информация о клиенте:</b>
Имя: ${order.customerInfo.firstName}
Фамилия: ${order.customerInfo.lastName}
Телефон: ${order.customerInfo.phone}
ID-карта: ${order.customerInfo.idCard}
Discord: ${order.customerInfo.discordNickname}
`

  const itemsList = order.items
    .map((item: any) => {
      let itemDetails = `- ${item.name} (${item.category}) - ${item.quantity} шт. x $${item.price.toLocaleString()}`
      if (item.ammoQuantity && item.ammoPrice) {
        itemDetails += ` + ${item.ammoQuantity} патронов x $${item.ammoPrice.toLocaleString()}`
      }
      return itemDetails
    })
    .join("\n")

  const orderDetails = `
<b>Детали заказа:</b>
Дата заказа: ${order.orderDate}
Общая сумма: <b>$${order.totalPrice.toLocaleString()}</b>

<b>Товары:</b>
${itemsList}
`

  return `
<b>Новый заказ!</b>
${customerInfo}
${orderDetails}
`
}
