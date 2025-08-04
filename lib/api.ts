// lib/api.ts
// Переэкспортируем Server Actions из соответствующих файлов

export { getProfile, updateProfile, uploadProfilePicture } from "@/app/actions/profile"
export { addOrder, getOrders } from "@/app/actions/orders"
