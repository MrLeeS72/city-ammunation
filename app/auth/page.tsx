"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "../context/AuthContext"
import { toast } from "@/hooks/use-toast"

// Validation functions
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{3}-\d{4}$/
  return phoneRegex.test(phone)
}

const validateIdCard = (idCard: string): boolean => {
  const idCardRegex = /^\d{2}[A-Z]{2}$/
  return idCardRegex.test(idCard)
}

const validatePostalCode = (postalCode: string): boolean => {
  // Discord nickname validation - basic check for reasonable length and characters
  return postalCode.length >= 2 && postalCode.length <= 32 && /^[a-zA-Z0-9_.-]+$/.test(postalCode)
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    idCard: "",
    postalCode: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { login, register } = useAuth()
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (isLogin) {
      // For login, only phone is required
      if (!formData.phone) {
        newErrors.phone = "Номер телефона обязателен"
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Формат телефона должен быть XXX-XXXX"
      }
    } else {
      // For registration, validate required fields
      if (!formData.firstName.trim()) {
        newErrors.firstName = "Имя обязательно для заполнения"
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Фамилия обязательна для заполнения"
      }

      if (!formData.phone) {
        newErrors.phone = "Номер телефона обязателен"
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Формат телефона должен быть XXX-XXXX"
      }

      if (!formData.postalCode) {
        newErrors.postalCode = "Discord никнейм обязателен"
      } else if (!validatePostalCode(formData.postalCode)) {
        newErrors.postalCode = "Discord никнейм должен содержать 2-32 символа (буквы, цифры, _, ., -)"
      }

      // ID card is optional but if provided, must be valid
      if (formData.idCard && !validateIdCard(formData.idCard)) {
        newErrors.idCard = "Формат ID-карты должен быть XXYY (XX - цифры, YY - заглавные латинские буквы)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      let success = false

      if (isLogin) {
        success = await login(formData.phone)
        if (!success) {
          toast({
            title: "Пользователь не найден",
            description: "Номер телефона не зарегистрирован в системе",
            variant: "destructive",
          })
        }
      } else {
        success = await register(formData)
        if (!success) {
          toast({
            title: "Ошибка регистрации",
            description: "Пользователь с таким номером телефона уже существует",
            variant: "destructive",
          })
        }
      }

      if (success) {
        toast({
          title: isLogin ? "Вход выполнен" : "Регистрация завершена",
          description: isLogin ? "Добро пожаловать!" : "Аккаунт успешно создан",
        })
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format phone number automatically
    if (name === "phone") {
      let formattedValue = value.replace(/\D/g, "") // Remove non-digits
      if (formattedValue.length >= 3) {
        formattedValue = formattedValue.slice(0, 3) + "-" + formattedValue.slice(3, 7)
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    }
    // Format ID card automatically
    else if (name === "idCard") {
      let formattedValue = value.toUpperCase().replace(/[^0-9A-Z]/g, "")
      if (formattedValue.length > 4) {
        formattedValue = formattedValue.slice(0, 4)
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    }
    // Format postal code (Discord nickname)
    else if (name === "postalCode") {
      const formattedValue = value.replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 32)
      setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      idCard: "",
      postalCode: "",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{isLogin ? "Вход в систему" : "Регистрация"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstName">Имя *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? "border-red-500" : ""}
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Фамилия *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? "border-red-500" : ""}
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="phone">Номер телефона *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="XXX-XXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? "border-red-500" : ""}
                  maxLength={8}
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="postalCode">Discord никнейм *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      placeholder="username123"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={errors.postalCode ? "border-red-500" : ""}
                      maxLength={32}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Ваш никнейм в Discord (2-32 символа)</p>
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>

                  <div>
                    <Label htmlFor="idCard">ID-карта</Label>
                    <Input
                      id="idCard"
                      name="idCard"
                      type="text"
                      placeholder="12AB"
                      value={formData.idCard}
                      onChange={handleInputChange}
                      className={errors.idCard ? "border-red-500" : ""}
                      maxLength={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Необязательно. Формат: XXYY (XX - цифры, YY - заглавные латинские буквы)
                    </p>
                    {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>}
                  </div>
                </>
              )}

              <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700">
                {isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button variant="link" onClick={switchMode} className="text-red-600 hover:text-red-700">
                {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
              </Button>
            </div>

            {!isLogin && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Обязательные поля отмечены *</strong>
                  <br />
                  Для входа в систему используйте ваш номер телефона.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
