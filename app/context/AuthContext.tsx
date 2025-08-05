"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"

interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  idCard?: string
  postalCode?: string // Discord username
  avatarUrl?: string
  licenses: string[]
  createdAt: string
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  ammoQuantity?: number
  ammoPrice?: number
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: string
  telegramMessageId?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  orders: Order[]
  loading: boolean
  error: string | null
  login: (phone: string) => Promise<boolean>
  register: (
    userData: Omit<User, "id" | "licenses" | "avatarUrl" | "createdAt"> & { avatarUrl?: string },
  ) => Promise<boolean>
  updateProfile: (userData: Partial<Omit<User, "id" | "phone" | "createdAt">>) => Promise<boolean>
  addOrder: (items: OrderItem[], total: number, telegramMessageId?: string) => Promise<boolean>
  addLicense: (license: string) => Promise<boolean>
  removeLicense: (license: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  const loadUserAndOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const storedPhone = localStorage.getItem("userPhone")
      if (!storedPhone) {
        setUser(null)
        setOrders([])
        setLoading(false)
        return
      }

      const { data, error: userError } = await supabase.from("users").select("*").eq("phone", storedPhone).single()

      if (userError && userError.code === "PGRST116") {
        // No rows found
        setUser(null)
        setOrders([])
        localStorage.removeItem("userPhone")
        setLoading(false)
        return
      }

      if (userError) {
        throw new Error(`Failed to fetch user: ${userError.message}`)
      }

      if (data) {
        const fetchedUser: User = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          idCard: data.idCard || "",
          postalCode: data.postalCode || "",
          avatarUrl: data.avatar_url || "", // Map from snake_case to camelCase
          licenses: data.licenses || [],
          createdAt: data.createdAt,
        }
        setUser(fetchedUser)

        const { data: userOrders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("userId", data.id)
          .order("createdAt", { ascending: false })

        if (ordersError) {
          throw new Error(`Failed to fetch orders: ${ordersError.message}`)
        }
        setOrders(userOrders || [])
      } else {
        setUser(null)
        setOrders([])
        localStorage.removeItem("userPhone")
      }
    } catch (err: any) {
      console.error("Error fetching user:", err)
      setError(err.message || "Failed to load user data.")
      setUser(null)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadUserAndOrders()
  }, [loadUserAndOrders])

  const login = async (phone: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: userError } = await supabase.from("users").select("*").eq("phone", phone).single()

      if (userError && userError.code === "PGRST116") {
        // No rows found
        setError("Пользователь с таким номером телефона не найден.")
        return false
      }

      if (userError) {
        throw new Error(`Ошибка входа: ${userError.message}`)
      }

      const loggedInUser: User = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        idCard: data.idCard || "",
        postalCode: data.postalCode || "",
        avatarUrl: data.avatar_url || "", // Map from snake_case to camelCase
        licenses: data.licenses || [],
        createdAt: data.createdAt,
      }
      setUser(loggedInUser)
      localStorage.setItem("userPhone", phone)
      await loadUserAndOrders() // Reload orders for the logged-in user
      return true
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Ошибка входа.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    userData: Omit<User, "id" | "licenses" | "createdAt"> & { avatarUrl?: string },
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      // Check if user with this phone already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("id")
        .eq("phone", userData.phone)
        .single()

      if (existingUser && !existingUserError) {
        setError("Пользователь с таким номером телефона уже зарегистрирован.")
        return false
      }

      const { data, error: insertError } = await supabase
        .from("users")
        .insert({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          idCard: userData.idCard || null,
          postalCode: userData.postalCode || null,
          licenses: [], // New users start with no licenses
          avatar_url: userData.avatarUrl || null, // Use snake_case for DB column
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(`Ошибка регистрации: ${insertError.message}`)
      }

      const newUser: User = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        idCard: data.idCard || "",
        postalCode: data.postalCode || "",
        avatarUrl: data.avatar_url || "", // Map from snake_case to camelCase
        licenses: data.licenses || [],
        createdAt: data.createdAt,
      }
      setUser(newUser)
      localStorage.setItem("userPhone", userData.phone)
      await loadUserAndOrders() // Reload orders for the newly registered user
      return true
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Ошибка регистрации.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<Omit<User, "id" | "phone" | "createdAt">>): Promise<boolean> => {
    if (!user) {
      setError("Пользователь не авторизован.")
      return false
    }
    setLoading(true)
    setError(null)
    try {
      const updateData: { [key: string]: any } = {}
      if (userData.firstName !== undefined) updateData.firstName = userData.firstName
      if (userData.lastName !== undefined) updateData.lastName = userData.lastName
      if (userData.idCard !== undefined) updateData.idCard = userData.idCard
      if (userData.postalCode !== undefined) updateData.postalCode = userData.postalCode
      if (userData.avatarUrl !== undefined) updateData.avatar_url = userData.avatarUrl // Use snake_case for DB column
      if (userData.licenses !== undefined) updateData.licenses = userData.licenses

      const { data, error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Ошибка обновления профиля: ${updateError.message}`)
      }

      const updatedUser: User = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        idCard: data.idCard || "",
        postalCode: data.postalCode || "",
        avatarUrl: data.avatar_url || "", // Map from snake_case to camelCase
        licenses: data.licenses || [],
        createdAt: data.createdAt,
      }
      setUser(updatedUser)
      return true
    } catch (err: any) {
      console.error("Profile update error:", err)
      setError(err.message || "Ошибка обновления профиля.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const addOrder = async (items: OrderItem[], total: number, telegramMessageId?: string): Promise<boolean> => {
    if (!user) {
      setError("Для оформления заказа необходимо войти в систему.")
      return false
    }
    setLoading(true)
    setError(null)
    try {
      const newOrder: Omit<Order, "id" | "createdAt"> = {
        userId: user.id,
        items: items,
        total: total,
        status: "pending", // Default status
        telegramMessageId: telegramMessageId || null,
      }

      const { data, error: orderError } = await supabase.from("orders").insert(newOrder).select().single()

      if (orderError) {
        throw new Error(`Ошибка оформления заказа: ${orderError.message}`)
      }

      setOrders((prevOrders) => [data, ...prevOrders])
      return true
    } catch (err: any) {
      console.error("Order creation error:", err)
      setError(err.message || "Ошибка оформления заказа.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const addLicense = async (license: string): Promise<boolean> => {
    if (!user) {
      setError("Пользователь не авторизован.")
      return false
    }
    if (user.licenses.includes(license)) {
      setError("Эта лицензия уже добавлена.")
      return false
    }
    setLoading(true)
    setError(null)
    try {
      const updatedLicenses = [...user.licenses, license]
      const { data, error: updateError } = await supabase
        .from("users")
        .update({ licenses: updatedLicenses })
        .eq("id", user.id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Ошибка добавления лицензии: ${updateError.message}`)
      }

      const updatedUser: User = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        idCard: data.idCard || "",
        postalCode: data.postalCode || "",
        avatarUrl: data.avatar_url || "", // Map from snake_case to camelCase
        licenses: data.licenses || [],
        createdAt: data.createdAt,
      }
      setUser(updatedUser)
      return true
    } catch (err: any) {
      console.error("Add license error:", err)
      setError(err.message || "Ошибка добавления лицензии.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeLicense = async (license: string): Promise<boolean> => {
    if (!user) {
      setError("Пользователь не авторизован.")
      return false
    }
    setLoading(true)
    setError(null)
    try {
      const updatedLicenses = user.licenses.filter((l) => l !== license)
      const { data, error: updateError } = await supabase
        .from("users")
        .update({ licenses: updatedLicenses })
        .eq("id", user.id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Ошибка удаления лицензии: ${updateError.message}`)
      }

      const updatedUser: User = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        idCard: data.idCard || "",
        postalCode: data.postalCode || "",
        avatarUrl: data.avatar_url || "", // Map from snake_case to camelCase
        licenses: data.licenses || [],
        createdAt: data.createdAt,
      }
      setUser(updatedUser)
      return true
    } catch (err: any) {
      console.error("Remove license error:", err)
      setError(err.message || "Ошибка удаления лицензии.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        loading,
        error,
        login,
        register,
        updateProfile,
        addOrder,
        addLicense,
        removeLicense,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
