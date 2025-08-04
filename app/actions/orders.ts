"use server"

import { supabaseServer } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface OrderItem {
  product_id: string
  quantity: number
  price_at_purchase: number
  ammo_quantity?: number
  ammo_price_at_purchase?: number
}

interface OrderData {
  user_id: string
  total_price: number
  customer_first_name: string
  customer_last_name: string
  customer_phone: string
  customer_id_card: string
  customer_discord_nickname: string
  items: OrderItem[]
}

export async function getOrdersByUserId(userId: string) {
  const { data, error } = await supabaseServer
    .from("orders")
    .select(`
      *,
      order_items (
        *
      )
    `)
    .eq("user_id", userId)
    .order("order_date", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return { success: false, error: error.message, data: null }
  }
  return { success: true, data, error: null }
}

export async function addOrder(orderData: OrderData) {
  const {
    user_id,
    total_price,
    customer_first_name,
    customer_last_name,
    customer_phone,
    customer_id_card,
    customer_discord_nickname,
    items,
  } = orderData

  const { data: order, error: orderError } = await supabaseServer
    .from("orders")
    .insert({
      user_id,
      total_price,
      customer_first_name,
      customer_last_name,
      customer_phone,
      customer_id_card,
      customer_discord_nickname,
    })
    .select()
    .single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    return { success: false, error: orderError.message }
  }

  const orderItemsToInsert = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_purchase: item.price_at_purchase,
    ammo_quantity: item.ammo_quantity,
    ammo_price_at_purchase: item.ammo_price_at_purchase,
  }))

  const { error: orderItemsError } = await supabaseServer.from("order_items").insert(orderItemsToInsert)

  if (orderItemsError) {
    console.error("Error creating order items:", orderItemsError)
    return { success: false, error: orderItemsError.message }
  }

  revalidatePath("/profile")
  revalidatePath("/order")
  return { success: true, orderId: order.id }
}
