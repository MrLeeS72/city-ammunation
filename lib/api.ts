"use server"

import { getProfileByUserId, updateProfile } from "@/app/actions/profile"
import { createOrder, getOrdersByUserId } from "@/app/actions/orders"
import { sendTelegramMessage } from "@/app/actions/telegram"

export const api = {
  profile: {
    get: getProfileByUserId,
    update: updateProfile,
  },
  orders: {
    create: createOrder,
    get: getOrdersByUserId,
  },
  telegram: {
    send: sendTelegramMessage,
  },
}
