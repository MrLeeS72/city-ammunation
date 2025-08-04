"use server"

import { createServerSupabaseClient } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getProfileByUserId(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means "no rows found"
      console.error("Error fetching profile:", error)
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return { success: true, profile: data || null }
  } catch (error: any) {
    console.error("Server Action Error (getProfileByUserId):", error)
    return { success: false, error: error.message, profile: null }
  }
}

export async function updateProfile(userId: string, formData: FormData) {
  const supabase = createServerSupabaseClient()

  const username = formData.get("username") as string
  const full_name = formData.get("full_name") as string
  const phone_number = formData.get("phone_number") as string
  const address = formData.get("address") as string

  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          username,
          full_name,
          phone_number,
          address,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    revalidatePath("/profile") // Revalidate profile page to show updated data
    return { success: true, profile: data }
  } catch (error: any) {
    console.error("Server Action Error (updateProfile):", error)
    return { success: false, error: error.message, profile: null }
  }
}
