"use server"

import { supabaseServer } from "@/lib/db" // Импортируем серверный клиент Supabase
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
    const { data, error } = await supabaseServer
      .from("profiles")
      .select("id, first_name, last_name, phone, id_card, discord_nickname, profile_picture_url")
      .eq("id", userId)
      .single() // Ожидаем одну запись

    if (error && error.code !== "PGRST116") {
      // PGRST116 - "No rows found"
      console.error("Ошибка Supabase при получении профиля:", error)
      return null
    }

    if (!data) {
      return null
    }

    // Преобразуем данные к нужному формату
    const profile: UserProfile = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      idCard: data.id_card,
      discordNickname: data.discord_nickname,
      profilePictureUrl: data.profile_picture_url,
    }

    return profile
  } catch (error) {
    console.error("Непредвиденная ошибка при получении профиля:", error)
    return null
  }
}

/**
 * Создает новый профиль пользователя, если он еще не существует.
 * Эта функция идемпотентна: если профиль уже есть, она ничего не делает.
 */
export async function createProfileIfNotFound(userData: {
  id: string
  firstName: string
  lastName: string
  phone: string
  idCard: string
  discordNickname: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Проверяем, существует ли профиль
    const existingProfile = await getProfile(userData.id)
    if (existingProfile) {
      return { success: true } // Профиль уже существует, нет необходимости создавать
    }

    // Если не найден, вставляем новый профиль
    const { data, error } = await supabaseServer
      .from("profiles")
      .insert({
        id: userData.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        id_card: userData.idCard,
        discord_nickname: userData.discordNickname,
      })
      .select()

    if (error) {
      console.error("Ошибка Supabase при создании профиля:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/profile") // Перевалидируем страницу профиля после создания
    return { success: true }
  } catch (error) {
    console.error("Непредвиденная ошибка при создании профиля, если не найден:", error)
    return { success: false, error: "Не удалось создать профиль." }
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
    const { error } = await supabaseServer
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        id_card: data.idCard,
        discord_nickname: data.discordNickname,
        updated_at: new Date().toISOString(), // Обновляем updated_at вручную или через триггер БД
      })
      .eq("id", userId)

    if (error) {
      console.error("Ошибка Supabase при обновлении профиля:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/profile") // Перевалидируем страницу профиля
    return { success: true }
  } catch (error) {
    console.error("Непредвиденная ошибка при обновлении профиля:", error)
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
    const { error } = await supabaseServer
      .from("profiles")
      .update({ profile_picture_url: url, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      console.error("Ошибка Supabase при обновлении URL фото профиля:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/profile")
    return { success: true, url }
  } catch (error) {
    console.error("Непредвиденная ошибка при загрузке фотографии профиля:", error)
    return { success: false, error: "Не удалось загрузить фотографию профиля." }
  }
}
