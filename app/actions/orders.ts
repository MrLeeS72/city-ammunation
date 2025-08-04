"use server"

import { createServerSupabaseClient } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number; price: number }[],
  totalAmount: number,
) {
  const supabase = createServerSupabaseClient()

  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: userId, total_amount: totalAmount, status: "pending" })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }))

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems)

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError)
      throw new Error(`Failed to create order items: ${orderItemsError.message}`)
    }

    revalidatePath("/profile") // Revalidate profile page to show new order
    return { success: true, orderId: order.id }
  } catch (error: any) {
    console.error("Server Action Error (createOrder):", error)
    return { success: false, error: error.message }
  }
}

export async function getOrdersByUserId(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        total_amount,
        status,
        created_at,
        order_items (
          product_id,
          quantity,
          price_at_purchase
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    // For simplicity, we're assuming product_id can be mapped to a name.
    // In a real app, you'd likely join with a products table or fetch product details.
    const ordersWithProductNames = data?.map((order) => ({
      ...order,
      order_items: order.order_items.map((item) => ({
        ...item,
        product_name: `Product ${item.product_id.substring(0, 4)}...`, // Placeholder name
      })),
    }))

    return { success: true, orders: ordersWithProductNames || [] }
  } catch (error: any) {
    console.error("Server Action Error (getOrdersByUserId):", error)
    return { success: false, error: error.message, orders: [] }
  }
}
