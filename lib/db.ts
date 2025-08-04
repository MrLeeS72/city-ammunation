import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key environment variables.")
}

// Client-side Supabase client (for use in client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for use in Server Actions/Route Handlers)
// Note: For server-side, you might want to use a service role key for elevated privileges
// or handle authentication differently (e.g., with cookies for user sessions).
// For this example, we'll use the anon key for simplicity, but be aware of security implications.
export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error("Missing Supabase Service Role Key environment variable for server-side operations.")
  }
  return createClient(supabaseUrl, serviceRoleKey)
}
