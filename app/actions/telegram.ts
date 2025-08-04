"use server"

import { sendTelegramMessage } from "@/app/utils/telegram"

export async function sendOrderConfirmationToTelegram(
  orderId: string,
  totalAmount: number,
  items: { name: string; quantity: number; price: number }[],
) {
  const itemList = items
    .map((item) => `- ${item.name} (x${item.quantity}) - $${item.price.toLocaleString()}`)
    .join("\n")
  const message = `
<b>Новый заказ # ${orderId}</b>
Сумма: <b>$${totalAmount.toLocaleString()}</b>

<b>Товары:</b>
${itemList}
  `
  const result = await sendTelegramMessage(message)
  if (!result.success) {
    console.error("Failed to send Telegram order confirmation:", result.error)
  }
  return result
}
