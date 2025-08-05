import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, chatId } = await request.json()

    if (!message || !chatId) {
      return NextResponse.json({ error: "Message and chatId are required" }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !telegramChatId) {
      console.error("Telegram bot token or chat ID is not configured.")
      return NextResponse.json({ error: "Telegram bot not configured" }, { status: 500 })
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML", // Or MarkdownV2
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Telegram API error:", data)
      return NextResponse.json(
        { error: data.description || "Failed to send message to Telegram" },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, messageId: data.result.message_id })
  } catch (error) {
    console.error("Error in Telegram API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
