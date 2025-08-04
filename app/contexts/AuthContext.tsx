"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid" // Импортируем uuid для генерации уникальных ID

interface User {
  id: string // Добавляем уникальный ID для пользователя (UUID)
  lastName: string
  firstName: string
  phone: string
  idCard: string
  discordNickname: string
  profilePictureUrl?: string // Изменяем имя поля для консистентности с БД
}

interface AuthContextType {
  user: User | null
  // Разрешаем id и profilePictureUrl быть опциональными при вводе,
  // так как они могут быть сгенерированы/обновлены внутри контекста
  login: (userData: Omit<User, "id" | "profilePictureUrl"> & { id?: string; profilePictureUrl?: string }) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("ammu-nation-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (userData: Omit<User, "id" | "profilePictureUrl"> & { id?: string; profilePictureUrl?: string }) => {
    let userId = userData.id
    // Пытаемся найти существующий UUID для данного idCard
    const existingUsersByIdCard = JSON.parse(localStorage.getItem("ammu-nation-users-by-idcard") || "{}")
    if (!userId && existingUsersByIdCard[userData.idCard]) {
      userId = existingUsersByIdCard[userData.idCard]
    } else if (!userId) {
      userId = uuidv4() // Генерируем новый UUID, если не найден
    }

    const newUser: User = {
      id: userId, // Используем сгенерированный или найденный UUID
      ...userData,
      // Сохраняем profilePictureUrl, если он передан, иначе используем текущий из user
      profilePictureUrl:
        userData.profilePictureUrl !== undefined ? userData.profilePictureUrl : user?.profilePictureUrl,
    }

    setUser(newUser)
    localStorage.setItem("ammu-nation-user", JSON.stringify(newUser))
    // Сохраняем соответствие idCard к UUID для последующих сессий
    localStorage.setItem(
      "ammu-nation-users-by-idcard",
      JSON.stringify({
        ...existingUsersByIdCard,
        [userData.idCard]: userId,
      }),
    )
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ammu-nation-user")
    localStorage.removeItem("ammu-nation-cart")
    // НЕ удаляем ammu-nation-users-by-idcard, так как он хранит постоянные ID пользователей
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
