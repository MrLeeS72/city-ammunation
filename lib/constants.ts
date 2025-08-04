export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn(
    "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables. Telegram notifications will not work.",
  )
}
