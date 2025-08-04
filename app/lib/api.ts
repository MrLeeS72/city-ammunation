// lib/api.ts
"use server" // Добавляем эту директиву

// Переэкспортируем Server Actions из соответствующих файлов
// Пути теперь относительны к app/lib/api.ts
export { getProfile, updateProfile, uploadProfilePicture, createProfileIfNotFound } from "../actions/profile.ts"
export { addOrder, getOrders } from "../actions/orders.ts"
export { testDbConnection } from "../actions/db-test.ts"
