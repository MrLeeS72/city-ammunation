"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [idCard, setIdCard] = useState("")
  const [discordNickname, setDiscordNickname] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { login } = useAuth()

  const validateIdCard = (value: string) => {
    const regex = /^\d{2}[A-Z]{2}$/
    return regex.test(value)
  }

  const validatePhone = (value: string) => {
    const regex = /^\d{3}-\d{4}$/
    return regex.test(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!lastName.trim()) newErrors.lastName = "Фамилия обязательна"
    if (!firstName.trim()) newErrors.firstName = "Имя обязательно"
    if (!phone.trim()) {
      newErrors.phone = "Номер телефона обязателен"
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Формат: XXX-XXXX"
    }
    if (!idCard.trim()) {
      newErrors.idCard = "ID карта обязательна"
    } else if (!validateIdCard(idCard)) {
      newErrors.idCard = "Формат: XXYY (где X - цифра, Y - заглавная латинская буква)"
    }
    if (!discordNickname.trim()) newErrors.discordNickname = "Discord никнейм обязателен"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Simulate successful login/registration
      login({ firstName, lastName, phone, idCard, discordNickname })
      alert(isLogin ? "Вход выполнен успешно!" : "Регистрация успешна! Вы вошли в систему.")
      router.push("/profile") // Redirect to profile page after auth
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-red-600">
              {isLogin ? "Вход" : "Регистрация"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }))
                  }}
                  placeholder="Введите фамилию"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }))
                  }}
                  placeholder="Введите имя"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }))
                  }}
                  placeholder="XXX-XXXX"
                  maxLength={8}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="idCard">ID карта</Label>
                <Input
                  id="idCard"
                  type="text"
                  value={idCard}
                  onChange={(e) => {
                    setIdCard(e.target.value.toUpperCase()) // Автоматически переводим в верхний регистр
                    if (errors.idCard) setErrors((prev) => ({ ...prev, idCard: "" }))
                  }}
                  placeholder="XXYY (например: 12AB)"
                  maxLength={4}
                  className={errors.idCard ? "border-red-500" : ""}
                />
                {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>}
              </div>
              <div>
                <Label htmlFor="discordNickname">Discord никнейм</Label>
                <Input
                  id="discordNickname"
                  type="text"
                  value={discordNickname}
                  onChange={(e) => {
                    setDiscordNickname(e.target.value)
                    if (errors.discordNickname) setErrors((prev) => ({ ...prev, discordNickname: "" }))
                  }}
                  placeholder="Ваш Discord никнейм"
                  className={errors.discordNickname ? "border-red-500" : ""}
                />
                {errors.discordNickname && <p className="text-red-500 text-sm mt-1">{errors.discordNickname}</p>}
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3">
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-red-600 hover:text-red-700">
                {isLogin ? "У меня нет аккаунта" : "Уже есть аккаунт?"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
