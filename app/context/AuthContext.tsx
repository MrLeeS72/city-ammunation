"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase/client" // Import Supabase client

export interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  idCard: string
  postalCode: string
  avatar?: string
  licenses: string[]
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  items: Array<{
    name: string
    quantity: number
    price: number
    ammoQuantity?: number
    ammoPrice?: number
  }>
  total: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
  telegramMessageId?: string
}

interface AuthState {
  user: User | null
  orders: Order[]
  isLoading: boolean
}

interface AuthContextType {
  user: User | null
  orders: Order[]
  isLoading: boolean
  login: (phone: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "createdAt" | "avatar" | "licenses">) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  addOrder: (order: Omit<Order, "id" | "userId" | "createdAt">) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    orders: [],
    isLoading: true,
  })

  const fetchUserData = useCallback(async (phone: string) => {
    try {
      const { data: users, error: userError } = await supabase.from("users").select("*").eq("phone", phone).single()

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 means no rows found
        console.error("Error fetching user:", userError)
        return null
      }

      if (users) {
        const user: User = {
          id: users.id,
          firstName: users.first_name,
          lastName: users.last_name,
          phone: users.phone,
          idCard: users.id_card || "",
          postalCode: users.postal_code,
          avatar: users.avatar_url || "",
          licenses: users.licenses || [],
          createdAt: users.created_at,
        }

        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (ordersError) {
          console.error("Error fetching orders:", ordersError)
          return { user, orders: [] }
        }

        const userOrders: Order[] = orders.map((order: any) => ({
          id: order.id,
          userId: order.user_id,
          items: order.items,
          total: order.total,
          status: order.status,
          telegramMessageId: order.telegram_message_id,
          createdAt: order.created_at,
        }))

        return { user, orders: userOrders }
      }
      return null
    } catch (error) {
      console.error("Unexpected error in fetchUserData:", error)
      return null
    }
  }, [])

  useEffect(() => {
    const loadUserAndOrders = async () => {
      const loggedInUserPhone = localStorage.getItem("loggedInUserPhone")
      if (loggedInUserPhone) {
        const data = await fetchUserData(loggedInUserPhone)
        if (data) {
          setState({ user: data.user, orders: data.orders, isLoading: false })
        } else {
          localStorage.removeItem("loggedInUserPhone") // Clear invalid session
          setState({ user: null, orders: [], isLoading: false })
        }
      } else {
        setState({ user: null, orders: [], isLoading: false })
      }
    }
    loadUserAndOrders()
  }, [fetchUserData])

  const login = async (phone: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const data = await fetchUserData(phone)
      if (data) {
        localStorage.setItem("loggedInUserPhone", phone)
        setState({ user: data.user, orders: data.orders, isLoading: false })
        return true
      }
      return false
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const register = async (userData: Omit<User, "id" | "createdAt" | "avatar" | "licenses">): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      // Check if phone number already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("phone", userData.phone)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows found
        console.error("Error checking existing user:", checkError)
        return false
      }

      if (existingUser) {
        return false // Phone number already registered
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          id_card: userData.idCard || null,
          postal_code: userData.postalCode,
          avatar_url: null,
          licenses: [],
        })
        .select()
        .single()

      if (error) {
        console.error("Error registering user:", error)
        return false
      }

      const newUser: User = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        idCard: data.id_card || "",
        postalCode: data.postal_code,
        avatar: data.avatar_url || "",
        licenses: data.licenses || [],
        createdAt: data.created_at,
      }

      localStorage.setItem("loggedInUserPhone", newUser.phone)
      setState({ user: newUser, orders: [], isLoading: false })
      return true
    } catch (error) {
      console.error("Unexpected error during registration:", error)
      return false
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const logout = () => {
    localStorage.removeItem("loggedInUserPhone")
    setState({ user: null, orders: [], isLoading: false })
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!state.user) return false
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          id_card: userData.idCard,
          postal_code: userData.postalCode,
          avatar_url: userData.avatar,
          licenses: userData.licenses,
        })
        .eq("id", state.user.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating profile:", error)
        return false
      }

      const updatedUser: User = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        idCard: data.id_card || "",
        postalCode: data.postal_code,
        avatar: data.avatar_url || "",
        licenses: data.licenses || [],
        createdAt: data.created_at,
      }

      // If phone number changed, update localStorage
      if (updatedUser.phone !== state.user.phone) {
        localStorage.setItem("loggedInUserPhone", updatedUser.phone)
      }

      setState((prev) => ({ ...prev, user: updatedUser, isLoading: false }))
      return true
    } catch (error) {
      console.error("Unexpected error during profile update:", error)
      return false
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const addOrder = async (orderData: Omit<Order, "id" | "userId" | "createdAt">) => {
    if (!state.user) return

    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: state.user.id,
          items: orderData.items,
          total: orderData.total,
          status: orderData.status,
          telegram_message_id: orderData.telegramMessageId || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding order:", error)
        return
      }

      const newOrder: Order = {
        id: data.id,
        userId: data.user_id,
        items: data.items,
        total: data.total,
        status: data.status,
        telegramMessageId: data.telegram_message_id,
        createdAt: data.created_at,
      }

      setState((prev) => ({ ...prev, orders: [newOrder, ...prev.orders], isLoading: false }))
    } catch (error) {
      console.error("Unexpected error adding order:", error)
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        orders: state.orders,
        isLoading: state.isLoading,
        login,
        register,
        logout,
        updateProfile,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
