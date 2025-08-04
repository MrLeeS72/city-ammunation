import { createClient } from "@supabase/supabase-js"

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. Please ensure they are configured.",
  )
}

// Серверный клиент Supabase (для Server Actions)
// Создается каждый раз, когда вызывается Server Action, чтобы избежать проблем с кешированием
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)

// Клиентский клиент Supabase (синглтон)
// Используется на стороне клиента, если это необходимо (хотя в данном проекте большинство запросов через Server Actions)
let supabaseClientInstance: ReturnType<typeof createClient> | undefined

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClientInstance
}
