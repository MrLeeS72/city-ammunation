"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import Header from "../components/Header"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  ammoQuantity?: number
  ammoPrice?: number
}

export default function OrderPage() {
  const { cart, clearCart } = useCart()
  const { user, loading: authLoading, addOrder } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    idCard: user?.idCard || "",
    postalCode: user?.postalCode || "",
    deliveryMethod: "pickup",
    address: "",
    comment: "",
    confirmDetails: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Необходимо войти",
        description: "Пожалуйста, войдите в систему, чтобы оформить заказ.",
        variant: "destructive",
      })
      router.push("/auth")
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        idCard: user.idCard || "",
        postalCode: user.postalCode || "",
      }))
    }
  }, [user, authLoading, router])

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      const ammoTotal = (item.ammoPrice || 0) * (item.ammoQuantity || 0)
      return sum + itemTotal + ammoTotal
    }, 0)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Имя обязательно."
    if (!formData.lastName.trim()) newErrors.lastName = "Фамилия обязательна."
    if (!formData.phone.trim()) newErrors.phone = "Телефон обязателен."
    if (formData.deliveryMethod === "delivery" && !formData.address.trim()) {
      newErrors.address = "Адрес доставки обязателен для доставки."
    }
    if (!formData.confirmDetails) newErrors.confirmDetails = "Необходимо подтвердить данные."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        ammoQuantity: item.ammoQuantity,
        ammoPrice: item.ammoPrice,
      }))
      const totalAmount = calculateTotal()

      // Send order to Telegram bot
      const telegramMessage = `
        <b>НОВЫЙ ЗАКАЗ</b>
        <b>Пользователь:</b> ${formData.firstName} ${formData.lastName}
        <b>Телефон:</b> ${formData.phone}
        <b>ID-карта:</b> ${formData.idCard || "Не указана"}
        <b>Discord:</b> ${formData.postalCode || "Не указан"}
        <b>Метод доставки:</b> ${formData.deliveryMethod === "pickup" ? "Самовывоз" : "Доставка"}
        ${formData.deliveryMethod === "delivery" ? `<b>Адрес:</b> ${formData.address}` : ""}
        <b>Комментарий:</b> ${formData.comment || "Нет"}

        <b>Товары:</b>
        ${orderItems
          .map(
            (item) =>
              `- ${item.name} x${item.quantity} ($${item.price * item.quantity})` +
              (item.ammoQuantity && item.ammoPrice
                ? ` + ${item.ammoQuantity} пачек патронов ($${item.ammoPrice * item.ammoQuantity})`
                : ""),
          )
          .join("\n")}
        <b>Общая сумма:</b> $${totalAmount.toFixed(2)}
      `

      const telegramResponse = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: telegramMessage, chatId: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID }),
      })

      const telegramData = await telegramResponse.json()

      if (!telegramResponse.ok) {
        throw new Error(telegramData.error || "Failed to send message to Telegram")
      }

      // Add order to Supabase
      const orderAdded = await addOrder(orderItems, totalAmount, telegramData.messageId)

      if (orderAdded) {
        toast({
          title: "Заказ оформлен!",
          description: "Ваш заказ успешно отправлен. Мы свяжемся с вами в ближайшее время.",
        })
        clearCart()
        router.push("/profile") // Redirect to profile page to see order history
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить заказ в базе данных.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Order submission error:", error)
      toast({
        title: "Ошибка оформления заказа",
        description: error.message || "Произошла ошибка при оформлении заказа. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div>Загрузка...</div>
        </main>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Корзина пуста</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Добавьте товары в корзину, чтобы оформить заказ.</p>
              <Button onClick={() => router.push("/catalog")}>Перейти в каталог</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Оформление заказа</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ваши данные</CardTitle>
              <CardDescription>Проверьте и при необходимости обновите свои контактные данные.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="idCard">ID-карта</Label>
                <Input
                  id="idCard"
                  name="idCard"
                  value={formData.idCard}
                  onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="postalCode">Discord никнейм</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Метод получения</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.deliveryMethod}
                onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите метод получения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Самовывоз (Ammu-Nation)</SelectItem>
                  <SelectItem value="delivery">Доставка (по адресу)</SelectItem>
                </SelectContent>
              </Select>
              {formData.deliveryMethod === "delivery" && (
                <div className="mt-4">
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Улица, дом, квартира"
                    required
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Комментарий к заказу</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Любые дополнительные пожелания или инструкции..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                    <div>
                      <p className="font-medium">
                        {item.name} x {item.quantity}
                      </p>
                      {item.ammoQuantity && item.ammoQuantity > 0 && (
                        <p className="text-sm text-gray-600">Патроны: {item.ammoQuantity} пачек</p>
                      )}
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity + (item.ammoPrice || 0) * (item.ammoQuantity || 0)).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center font-bold text-lg mt-4 pt-4 border-t">
                <span>Итого:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmDetails"
                  checked={formData.confirmDetails}
                  onCheckedChange={(checked) => setFormData({ ...formData, confirmDetails: !!checked })}
                />
                <Label htmlFor="confirmDetails">Я подтверждаю правильность введенных данных</Label>
              </div>
              {errors.confirmDetails && <p className="text-red-500 text-sm">{errors.confirmDetails}</p>}
              <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                {isSubmitting ? "Оформление..." : "Оформить заказ"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
