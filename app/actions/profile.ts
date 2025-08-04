"use server"

import sql from "@/lib/db"
import { put, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  phone: string
  idCard: string
  discordNickname: string
  profilePictureUrl?: string | null
}

/**
 * Получает данные профиля пользователя из базы данных.
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const [profile] = await sql<UserProfile[]>`
      SELECT id, first_name as "firstName", last_name as "lastName", phone, id_card as "idCard", discord_nickname as "discordNickname", profile_picture_url as "profilePictureUrl"
      FROM profiles
      WHERE id = ${userId}
    `
    return profile || null
  } catch (error) {
    console.error("Ошибка при получении профиля:", error)
    return null
  }
}

/**
 * Обновляет данные профиля пользователя в базе данных.
 */
export async function updateProfile(
  userId: string,
  data: Omit<UserProfile, "id" | "profilePictureUrl">,
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE profiles
      SET
        first_name = ${data.firstName},
        last_name = ${data.lastName},
        phone = ${data.phone},
        id_card = ${data.idCard},
        discord_nickname = ${data.discordNickname},
        updated_at = NOW()
      WHERE id = ${userId}
    `
    revalidatePath("/profile") // Перевалидируем страницу профиля
    return { success: true }
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error)
    return { success: false, error: "Не удалось обновить профиль." }
  }
}

/**
 * Загружает фотографию профиля в Vercel Blob и обновляет URL в базе данных.
 */
export async function uploadProfilePicture(
  userId: string,
  file: File,
  currentPictureUrl?: string | null,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Удаляем старое изображение, если оно есть
    if (currentPictureUrl) {
      try {
        await del(currentPictureUrl)
      } catch (deleteError) {
        console.warn("Не удалось удалить старое изображение:", deleteError)
        // Продолжаем выполнение, даже если удаление старого изображения не удалось
      }
    }

    // Генерируем уникальное имя файла
    const filename = `${userId}-${uuidv4()}.${file.name.split(".").pop()}`
    const { url } = await put(`avatars/${filename}`, file, { access: "public" })

    // Обновляем URL фотографии в базе данных
    await sql`
      UPDATE profiles
      SET profile_picture_url = ${url}, updated_at = NOW()
      WHERE id = ${userId}
    `
    revalidatePath("/profile")
    return { success: true, url }
  } catch (error) {
    console.error("Ошибка при загрузке фотографии профиля:", error)
    return { success: false, error: "Не удалось загрузить фотографию профиля." }
  }
}
