"use client"

import Link from "next/link"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { User, Phone, CreditCard, MessageCircle, Camera, History, Package, Loader2 } from "lucide-react"
import Image from "next/image"

// Обновим импорт Server Actions
// Было: import { getProfile, updateProfile, uploadProfilePicture, createProfileIfNotFound } from "@/lib/api"
// Стало:
import { getProfile, updateProfile, uploadProfilePicture, createProfileIfNotFound } from "../lib/api"
import { getOrders } from "../lib/api"

interface UserProfileData {
  id: string
  firstName: string
  lastName: string
  phone: string
  idCard: string
  discordNickname: string
  profilePictureUrl?: string | null
}

interface StoredOrder {
  id: string
  userId: string
  orderDate: string
  totalPrice: number
  itemsJson: Array<{
    id: string
    name: string
    category: string
    quantity: number
    price: number
    ammoQuantity?: number
    ammoPrice?: number
    image: string
  }>
  createdAt: string
}

export default function Profile() {
  const { user, login, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<UserProfileData, "id">>({
    lastName: "",
    firstName: "",
    phone: "",
    idCard: "",
    discordNickname: "",
    profilePictureUrl: null,
  })
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<StoredOrder[]>([])

  // Загрузка данных профиля и истории заказов
  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const profileData = await getProfile(user.id) // Используем user.id (UUID)
      if (profileData) {
        setFormData({
          lastName: profileData.lastName || "",
          firstName: profileData.firstName || "",
          phone: profileData.phone || "",
          idCard: profileData.idCard || "",
          discordNickname: profileData.discordNickname || "",
          profilePictureUrl: profileData.profilePictureUrl || null,
        })
        setProfilePicturePreview(profileData.profilePictureUrl || null)
        // Обновляем AuthContext user с profilePictureUrl из БД
        login({ ...user, profilePictureUrl: profileData.profilePictureUrl || undefined })
      } else {
        // Если профиль не найден в БД, создаем его через Server Action
        const createResult = await createProfileIfNotFound({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          idCard: user.idCard,
          discordNickname: user.discordNickname,
        })

        if (!createResult.success) {
          console.error("Failed to create profile on first load:", createResult.error)
          // Можно установить ошибку для отображения пользователю
        }

        // Устанавливаем formData и preview на основе данных из AuthContext,
        // так как это начальное состояние для нового профиля
        setFormData({
          lastName: user.lastName || "",
          firstName: user.firstName || "",
          phone: user.phone || "",
          idCard: user.idCard || "",
          discordNickname: user.discordNickname || "",
          profilePictureUrl: null,
        })
        setProfilePicturePreview(null)
      }

      const userOrders = await getOrders(user.id) // Используем user.id (UUID)
      setOrders(userOrders)
    } catch (err) {
      console.error("Ошибка при загрузке данных профиля/заказов:", err)
      // Можно установить ошибку для отображения пользователю
    } finally {
      setIsLoading(false)
    }
  }, [user, login]) // Добавляем login в зависимости

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    } else {
      fetchData()
    }
  }, [isAuthenticated, router, fetchData])

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600" />
          <p className="ml-4 text-lg text-gray-600">Загрузка профиля...</p>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
        </footer>
      </div>
    )
  }

  const validateIdCard = (idCard: string): boolean => {
    const regex = /^\d{2}[A-Z]{2}$/
    return regex.test(idCard)
  }

  const validatePhone = (phone: string): boolean => {
    const regex = /^\d{3}-\d{4}$/
    return regex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return // Используем user.id

    const newErrors: Record<string, string> = {}

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
      setIsLoading(true)
      try {
        const result = await updateProfile(user.id, {
          // Используем user.id
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          idCard: formData.idCard,
          discordNickname: formData.discordNickname,
        })
        if (result.success) {
          // Обновляем данные в AuthContext, чтобы они были актуальными
          login({ ...user, ...formData }) // formData теперь содержит profilePictureUrl
          setIsEditing(false)
          alert("Профиль успешно обновлен!")
        } else {
          alert(`Ошибка при обновлении профиля: ${result.error}`)
        }
      } catch (err) {
        console.error("Ошибка при отправке формы профиля:", err)
        alert("Произошла ошибка при сохранении профиля.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user?.id) {
      // Используем user.id
      setIsLoading(true)
      try {
        const result = await uploadProfilePicture(user.id, file, formData.profilePictureUrl) // Используем user.id
        if (result.success && result.url) {
          setProfilePicturePreview(result.url)
          setFormData((prev) => ({ ...prev, profilePictureUrl: result.url }))
          login({ ...user, profilePictureUrl: result.url }) // Обновляем AuthContext
          alert("Фото профиля успешно загружено!")
        } else {
          alert(`Ошибка при загрузке фото: ${result.error}`)
        }
      } catch (err) {
        console.error("Ошибка при загрузке файла:", err)
        alert("Произошла ошибка при загрузке фото.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-red-600 text-center">Личный кабинет</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Карточка профиля */}
          <Card className="w-full max-w-2xl mx-auto lg:mx-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-red-600">Мой профиль</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-32 h-32 mb-4 border-4 border-red-600">
                  <AvatarImage
                    src={profilePicturePreview || "/placeholder.svg?height=128&width=128&query=user profile picture"}
                    alt="Фото профиля"
                  />
                  <AvatarFallback className="text-4xl bg-red-100 text-red-600">
                    {user?.firstName?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="relative">
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      aria-label="Загрузить фото профиля"
                      disabled={isLoading}
                    />
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent" disabled={isLoading}>
                      <Camera className="h-4 w-4" />
                      {isLoading ? "Загрузка..." : "Загрузить фото"}
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4 text-lg">
                  <p>
                    <span className="font-semibold">Фамилия:</span> {formData.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">Имя:</span> {formData.firstName}
                  </p>
                  <p>
                    <span className="font-semibold">Телефон:</span> {formData.phone}
                  </p>
                  <p>
                    <span className="font-semibold">ID Карта:</span> {formData.idCard}
                  </p>
                  <p>
                    <span className="font-semibold">Discord никнейм:</span> {formData.discordNickname}
                  </p>
                  <Button onClick={() => setIsEditing(true)} className="w-full bg-red-600 hover:bg-red-700">
                    Редактировать профиль
                  </Button>
                </div>
              ) : (
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                    {errors.discordNickname && <p className="text-red-500 text-sm mt-1">{errors.discordNickname}</p>}
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={isLoading}>
                      {isLoading ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Карточка истории покупок */}
          <Card className="w-full max-w-2xl mx-auto lg:mx-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-red-600 flex items-center justify-center gap-2">
                <History className="h-6 w-6" />
                История покупок
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Package className="h-16 w-16 mx-auto mb-4" />
                  <p>У вас пока нет заказов.</p>
                  <p>
                    Оформите свой первый заказ в{" "}
                    <Link href="/catalog" className="text-red-600 hover:underline">
                      каталоге
                    </Link>
                    !
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {orders.map((order) => (
                    <AccordionItem key={order.id} value={order.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">
                            Заказ от {new Date(order.orderDate).toLocaleDateString("ru-RU")}
                          </span>
                          <span className="text-sm text-gray-600">Сумма: ${order.totalPrice.toLocaleString()}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 p-2">
                          <p className="font-semibold text-gray-700">Детали заказа:</p>
                          {order.itemsJson.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4 border-b pb-2 last:border-b-0 last:pb-0"
                            >
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="object-contain bg-white rounded border flex-shrink-0"
                              />
                              <div className="flex-grow">
                                <p className="font-medium">
                                  {item.name} x{item.quantity}
                                </p>
                                <p className="text-sm text-gray-600">Цена: ${item.price.toLocaleString()}</p>
                                {item.ammoQuantity && item.ammoQuantity > 0 && (
                                  <p className="text-sm text-gray-600">
                                    Патроны: x{item.ammoQuantity} пачек (${item.ammoPrice?.toLocaleString()}/пачка)
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-red-600">
                                $
                                {(
                                  item.price * item.quantity +
                                  (item.ammoQuantity || 0) * (item.ammoPrice || 0)
                                ).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
