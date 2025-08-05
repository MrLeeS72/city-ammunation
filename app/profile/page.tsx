"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../context/AuthContext"
import { toast } from "@/hooks/use-toast"
import { Camera, X, Plus, Package } from "lucide-react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
  return postalCode.length >= 2 && postalCode.length <= 32 && /^[a-zA-Z0-9_.-]+$/.test(postalCode)
}

// Available license types
const availableLicenses = ['Категория "9мм"', 'Категория "A"', 'Категория "B"', 'Категория "C"', 'Категория "D"']

// Status colors and labels for orders
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "В обработке",
  confirmed: "Подтвержден",
  completed: "Выполнен",
  cancelled: "Отменен",
}

export default function Profile() {
  const { user, updateProfile, isLoading, orders, logout } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    idCard: "",
    postalCode: "",
    avatar: "",
    licenses: [] as string[],
  })
  const [newLicense, setNewLicense] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
      return
    }

    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        idCard: user.idCard || "",
        postalCode: user.postalCode || "",
        avatar: user.avatar || "",
        licenses: user.licenses || [],
      })
    }
  }, [user, isLoading, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Имя обязательно для заполнения"
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Фамилия обязательна для заполнения"
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Номер телефона обязателен"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Формат телефона должен быть XXX-XXXX"
    }

    // Validate postal code
    if (!formData.postalCode) {
      newErrors.postalCode = "Discord никнейм обязателен"
    } else if (!validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = "Discord никнейм должен содержать 2-32 символа (буквы, цифры, _, ., -)"
    }

    // Validate ID card (optional but if provided, must be valid)
    if (formData.idCard && !validateIdCard(formData.idCard)) {
      newErrors.idCard = "Формат ID-карты должен быть XXYY (XX - цифры, YY - заглавные латинские буквы)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Файл слишком большой",
          description: "Максимальный размер файла 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Неверный тип файла",
          description: "Пожалуйста, выберите изображение",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData((prev) => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addLicense = () => {
    if (newLicense && !formData.licenses.includes(newLicense)) {
      setFormData((prev) => ({
        ...prev,
        licenses: [...prev.licenses, newLicense],
      }))
      setNewLicense("")
    }
  }

  const removeLicense = (licenseToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((license) => license !== licenseToRemove),
    }))
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    try {
      const success = await updateProfile(formData)
      if (success) {
        setIsEditing(false)
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены",
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить профиль",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        idCard: user.idCard || "",
        postalCode: user.postalCode || "",
        avatar: user.avatar || "",
        licenses: user.licenses || [],
      })
    }
    setIsEditing(false)
    setErrors({})
    setNewLicense("")
  }

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div>Загрузка...</div>
        </main>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Профиль пользователя</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Аватар
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Редактировать
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                {formData.avatar ? (
                  <div className="relative">
                    <Image
                      src={formData.avatar || "/placeholder.svg"}
                      alt="Аватар"
                      width={120}
                      height={120}
                      className="rounded-full object-cover border-4 border-gray-200"
                    />
                    {isEditing && (
                      <Button
                        onClick={removeAvatar}
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex flex-col items-center space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {formData.avatar ? "Изменить фото" : "Загрузить фото"}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Максимальный размер: 5MB
                    <br />
                    Поддерживаемые форматы: JPG, PNG, GIF
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={errors.lastName ? "border-red-500" : ""}
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Номер телефона *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="XXX-XXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={errors.phone ? "border-red-500" : ""}
                  maxLength={8}
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="postalCode">Discord никнейм *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="username123"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  className={errors.idCard ? "border-red-500" : ""}
                  maxLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Необязательно. Формат: XXYY (XX - цифры, YY - заглавные латинские буквы)
                </p>
                {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Имеющиеся лицензии</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.licenses.length > 0 ? (
                  formData.licenses.map((license, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                      {license}
                      {isEditing && (
                        <Button
                          onClick={() => removeLicense(license)}
                          size="sm"
                          variant="ghost"
                          className="ml-2 h-4 w-4 p-0 hover:bg-red-200"
                          aria-label={`Удалить лицензию ${license}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Лицензии не указаны</p>
                )}
              </div>

              {isEditing && (
                <>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor="newLicense">Добавить новую лицензию</Label>
                      <select
                        id="newLicense"
                        value={newLicense}
                        onChange={(e) => setNewLicense(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full"
                      >
                        <option value="">Выберите лицензию</option>
                        {availableLicenses
                          .filter((license) => !formData.licenses.includes(license))
                          .map((license) => (
                            <option key={license} value={license}>
                              {license}
                            </option>
                          ))}
                      </select>
                    </div>
                    <Button
                      onClick={addLicense}
                      disabled={!newLicense}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent h-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Выберите лицензию из списка, чтобы добавить ее. Нажмите "X" на существующей лицензии, чтобы удалить
                    ее.
                  </p>
                </>
              )}

              <div className="text-xs text-gray-500">
                <p>Укажите категории лицензий на оружие, которые у вас имеются.</p>
                <p>Это поможет нам лучше обслуживать вас и предлагать подходящие товары.</p>
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-red-600 hover:bg-red-700">
                    {isSaving ? "Сохранение..." : "Сохранить"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Информация об аккаунте</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </p>
                <p>
                  <strong>ID пользователя:</strong> {user.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order History Section */}
          <Card>
            <CardHeader>
              <CardTitle>История заказов</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                  <h2 className="text-2xl font-bold mb-4 text-gray-600">Заказов пока нет</h2>
                  <p className="text-gray-500 mb-8">Ваши заказы будут отображаться здесь</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {orders.map((order) => (
                    <AccordionItem key={order.id} value={order.id}>
                      <AccordionTrigger>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4">
                          <span className="font-medium">Заказ #{order.id.substring(0, 8)}</span>
                          <span className="text-sm text-gray-600">
                            Дата: {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-gray-600">Сумма: ${order.total.toFixed(2)}</span>
                          <Badge className={`mt-1 sm:mt-0 ${statusColors[order.status]} text-white`}>
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 border-t mt-2">
                          <h4 className="font-semibold mb-2">Детали заказа:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {order.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item.name} - {item.quantity} шт. @ ${item.price.toFixed(2)}/шт.
                                {item.ammoQuantity && item.ammoPrice && (
                                  <span>
                                    {" "}
                                    (Патроны: {item.ammoQuantity} шт. @ ${item.ammoPrice.toFixed(2)}/шт.)
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                          {order.telegramMessageId && (
                            <p className="mt-2 text-sm text-gray-700">
                              ID сообщения Telegram: {order.telegramMessageId}
                            </p>
                          )}
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
