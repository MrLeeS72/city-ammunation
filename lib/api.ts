// lib/api.ts
// Переэкспортируем Server Actions из соответствующих файлов

export { getProfile, updateProfile, uploadProfilePicture, createProfileIfNotFound } from "@/app/actions/profile"
export { addOrder, getOrders } from "@/app/actions/orders"
export { testDbConnection } from "@/app/actions/db-test" // Добавляем экспорт для testDbConnection
