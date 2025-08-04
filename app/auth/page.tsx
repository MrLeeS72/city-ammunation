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
import { User, Phone, CreditCard, MessageCircle } from "lucide-react"

export default function Auth() {
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    idCard: "",
    discordNickname: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/")
    return null
  }

  const validateIdCard = (idCard: string): boolean => {
    const regex = /^\d{2}[A-Z]{2}$/
    return regex.test(idCard)
  }

  const validatePhone = (phone: string): boolean => {
    const regex = /^\d{3}-\d{4}$/
    return regex.test(phone)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validate required fields
    if (!formData.lastName.trim()) newErrors.lastName = "Фамилия обязательна"
    if (!formData.firstName.trim()) newErrors.firstName = "Имя обязательно"
    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Формат: XXX-XXXX"
    }
    if (!formData.idCard.trim()) {
      newErrors.idCard = "ID карта обязательна"
    } else if (!validateIdCard(formData.idCard)) {
      newErrors.idCard = "Формат: XXYY (где X - цифра, Y - заглавная латинская буква)"
    }
    if (!formData.discordNickname.trim()) newErrors.discordNickname = "Discord никнейм обязателен"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      login(formData)
      router.push("/")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-red-600">Регистрация в City Ammu-Nation</CardTitle>
            <p className="text-center text-gray-600">Заполните данные для доступа к каталогу и оформления заказов</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="lastName" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Фамилия
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "border-red-500" : ""}
                  placeholder="Введите фамилию"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <Label htmlFor="firstName" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Имя
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "border-red-500" : ""}
                  placeholder="Введите имя"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Номер телефона
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                  placeholder="XXX-XXXX"
                  maxLength={8}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="idCard" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  ID карта
                </Label>
                <Input
                  id="idCard"
                  name="idCard"
                  type="text"
                  value={formData.idCard}
                  onChange={handleChange}
                  className={errors.idCard ? "border-red-500" : ""}
                  placeholder="XXYY (например: 12AB)"
                  maxLength={4}
                  style={{ textTransform: "uppercase" }}
                />
                {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>}
              </div>

              <div>
                <Label htmlFor="discordNickname" className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discord никнейм
                </Label>
                <Input
                  id="discordNickname"
                  name="discordNickname"
                  type="text"
                  value={formData.discordNickname}
                  onChange={handleChange}
                  className={errors.discordNickname ? "border-red-500" : ""}
                  placeholder="Ваш Discord никнейм"
                />
                {errors.discordNickname && <p className="text-red-500 text-sm mt-1">{errors.discordNickname}</p>}
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Зарегистрироваться
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
