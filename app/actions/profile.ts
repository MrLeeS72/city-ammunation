"use server"

import { supabaseServer } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getProfileByUserId(userId: string) {
  const { data, error } = await supabaseServer.from("profiles").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 means no rows found
    console.error("Error fetching profile:", error)
    return null
  }
  return data
}

export async function updateProfile(userId: string, formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const idCard = formData.get("idCard") as string
  const discordNickname = formData.get("discordNickname") as string

  const { data, error } = await supabaseServer
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      id_card: idCard,
      discord_nickname: discordNickname,
    })
    .eq("user_id", userId)
    .select()

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true, data }
}

export async function uploadProfilePicture(userId: string, formData: FormData) {
  const file = formData.get("avatar") as File

  if (!file) {
    return { success: false, error: "No file provided." }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { data, error } = await supabaseServer.storage
    .from("avatars") // Assuming you have a storage bucket named 'avatars'
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (error) {
    console.error("Error uploading profile picture:", error)
    return { success: false, error: error.message }
  }

  const { data: publicUrlData } = supabaseServer.storage.from("avatars").getPublicUrl(filePath)

  const publicUrl = publicUrlData.publicUrl

  // Update profile with avatar URL
  const { error: updateError } = await supabaseServer
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("user_id", userId)

  if (updateError) {
    console.error("Error updating profile with avatar URL:", updateError)
    return { success: false, error: updateError.message }
  }

  revalidatePath("/profile")
  return { success: true, publicUrl }
}

export async function createProfileIfNotFound(userId: string) {
  const { data: existingProfile, error: fetchError } = await supabaseServer
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error checking for existing profile:", fetchError)
    return { success: false, error: fetchError.message }
  }

  if (!existingProfile) {
    const { data, error: createError } = await supabaseServer
      .from("profiles")
      .insert({ user_id: userId })
      .select()
      .single()

    if (createError) {
      console.error("Error creating new profile:", createError)
      return { success: false, error: createError.message }
    }
    return { success: true, data }
  }
  return { success: true, data: existingProfile }
}
