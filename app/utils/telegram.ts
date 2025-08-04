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

export async function sendOrderToTelegram(orderData: OrderData): Promise<{ success: boolean; error?: string }> {
  // Теперь эти переменные будут доступны только на сервере, так как у них нет префикса NEXT_PUBLIC_
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("ОШИБКА: Токен бота Telegram или ID чата не настроены в переменных окружения сервера.")
    return {
      success: false,
      error: "Токен бота Telegram или ID чата не настроены. Пожалуйста, настройте переменные окружения на Vercel.",
    }
  }

  try {
    console.log("Попытка отправить заказ в Telegram...")

    const customer = orderData.customerInfo
    const items = orderData.items

    // Формируем сообщение для Telegram
    let messageText = `*НОВЫЙ ЗАКАЗ В AMMU-NATION*\n\n`
    messageText += `*Дата заказа:* ${orderData.orderDate}\n\n`
    messageText += `*Данные покупателя:*\n`
    messageText += `Имя: ${customer.firstName} ${customer.lastName}\n`
    messageText += `Телефон: ${customer.phone}\n`
    messageText += `ID Карта: ${customer.idCard}\n`
    messageText += `Почтовый адрес: ${customer.discordNickname}\n\n`
    messageText += `*Детали заказа:*\n`

    items.forEach((item, index) => {
      messageText += `${index + 1}. ${item.name} x${item.quantity} (${item.price.toLocaleString()}$)\n`
      if (item.ammoQuantity && item.ammoQuantity > 0) {
        messageText += `   Патроны: x${item.ammoQuantity} пачек (${item.ammoPrice?.toLocaleString()}$/пачка)\n`
      }
    })

    messageText += `\n*Общая сумма:* ${orderData.totalPrice.toLocaleString()}$`

    // Экранируем специальные символы для MarkdownV2
    messageText = messageText.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1")
    // Но не экранируем звездочки, которые используются для жирного текста
    messageText = messageText.replace(/\\\*/g, "*")
    messageText = messageText.replace(/\\_/g, "_")

    const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // Таймаут 15 секунд

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: "MarkdownV2", // Используем MarkdownV2 для форматирования
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Ошибка Telegram API:", response.status, response.statusText, errorData)
      throw new Error(`Ошибка Telegram API: ${errorData.description || response.statusText}`)
    }

    const result = await response.json()
    console.log("Ответ от Telegram API:", result)

    if (result.ok) {
      return { success: true }
    } else {
      return { success: false, error: result.description || "Неизвестная ошибка Telegram." }
    }
  } catch (error) {
    console.error("Ошибка при отправке заказа в Telegram (catch блок):", error)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error:
            "Превышено время ожидания запроса (15 секунд). Проверьте подключение к интернету или работу Telegram API.",
        }
      }
      if (error.message.includes("Failed to fetch")) {
        return {
          success: false,
          error:
            "Ошибка сети. Убедитесь, что у вас есть подключение к интернету и Telegram API доступен. Проверьте консоль браузера (вкладка Network) для деталей.",
        }
      }
      return { success: false, error: "Неизвестная ошибка при отправке заказа в Telegram." }
    }

    return { success: false, error: "Неизвестная ошибка при отправке заказа в Telegram." }
  }
}
