// lib/api.ts
"use server" // Добавляем эту директиву

// Переэкспортируем Server Actions из соответствующих файлов
export { getProfile, updateProfile, uploadProfilePicture, createProfileIfNotFound } from "../app/actions/profile.ts"
export { addOrder, getOrders } from "../app/actions/orders.ts"
export { testDbConnection } from "../app/actions/db-test.ts"
