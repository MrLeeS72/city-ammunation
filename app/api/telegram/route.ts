import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Изменено: удален NEXT_PUBLIC_ префикс
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Telegram configuration missing" }, { status: 500 })
    }

    // Build message
    let message = `🛒 *Новый заказ из City Ammu-Nation*\n\n`

    // Add user info if available
    if (orderData.user) {
      message += `👤 *Клиент:* ${orderData.user.firstName} ${orderData.user.lastName}\n`
      message += `📱 *Телефон:* ${orderData.user.phone}\n`
      message += `💬 *Discord:* ${orderData.user.postalCode}\n`
      if (orderData.user.idCard) {
        message += `🆔 *ID-карта:* ${orderData.user.idCard}\n`
      }
      message += `\n`
    }

    message += `📦 *Товары:*\n`

    orderData.items.forEach((item: any, index: number) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   Количество: ${item.quantity} шт.\n`
      message += `   Цена за единицу: $${item.price}\n`

      if (item.ammoQuantity && item.ammoPrice) {
        message += `   Патроны: ${item.ammoQuantity} пачек по $${item.ammoPrice}\n`
      }

      const itemTotal =
        item.price * item.quantity + (item.ammoPrice && item.ammoQuantity ? item.ammoPrice * item.ammoQuantity : 0)
      message += `   Итого за товар: $${itemTotal}\n\n`
    })

    message += `💰 *Общая сумма заказа: $${orderData.total}*\n\n`
    message += `🕐 *Время заказа:* ${new Date().toLocaleString("ru-RU")}`

    // Send to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json()
      console.error("Telegram API error:", errorData)
      throw new Error(`Telegram API error: ${errorData.description || "Unknown error"}`)
    }

    const result = await telegramResponse.json()

    return NextResponse.json({
      success: true,
      messageId: result.result.message_id,
    })
  } catch (error) {
    console.error("Error in telegram API route:", error)
    return NextResponse.json({ error: "Failed to send message to Telegram" }, { status: 500 })
  }
}
