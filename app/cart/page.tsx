"use client"

import { useState } from "react"
import Header from "../components/Header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function Cart() {
  const { state: cartState, dispatch } = useCart()
  const { user, addOrder } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const updateAmmoQuantity = (id: string, ammoQuantity: number) => {
    dispatch({ type: "UPDATE_AMMO_QUANTITY", payload: { id, ammoQuantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
    toast({
      title: "Товар удален",
      description: "Товар удален из корзины",
    })
  }

  const sendToTelegram = async (orderData: any) => {
    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message to Telegram")
      }

      const result = await response.json()
      return result.messageId
    } catch (error) {
      console.error("Error sending to Telegram:", error)
      throw error
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для оформления заказа",
        variant: "destructive",
      })
      return
    }

    if (cartState.items.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары в корзину перед оформлением заказа",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        items: cartState.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          ammoQuantity: item.ammoQuantity,
          ammoPrice: item.ammoPrice,
        })),
        total: cartState.total,
        status: "pending" as const,
      }

      // Send to Telegram
      const telegramMessageId = await sendToTelegram({
        ...orderData,
        user: user,
      })

      // Add order to user's history
      addOrder({
        ...orderData,
        telegramMessageId: telegramMessageId.toString(),
      })

      // Clear cart
      dispatch({ type: "CLEAR_CART" })

      toast({
        title: "Заказ оформлен!",
        description: "Ваш заказ отправлен в обработку. Мы свяжемся с вами в ближайшее время.",
      })
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "Ошибка при оформлении заказа",
        description: "Попробуйте еще раз или свяжитесь с нами по телефону",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-600">Корзина пуста</h1>
            <p className="text-gray-500 mb-8">Добавьте товары из каталога в корзину</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartState.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-contain bg-white rounded border"
                    />

                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{item.category}</p>
                      <p className="text-lg font-bold">${item.price}</p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {/* Weapon Quantity */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Количество:</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Ammo Quantity (if applicable and not ammo-only item) */}
                      {item.ammoPrice && item.category !== "Патроны" && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Патроны:</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAmmoQuantity(item.id, (item.ammoQuantity || 1) - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.ammoQuantity || 0}
                            onChange={(e) => updateAmmoQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                            className="w-16 text-center"
                            min="0"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAmmoQuantity(item.id, (item.ammoQuantity || 0) + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-600">пачек по ${item.ammoPrice}</span>
                        </div>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="self-start"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Итого заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartState.items.map((item) => {
                  if (item.category === "Патроны") {
                    // Для отдельных патронов
                    const itemTotal = item.price * item.quantity
                    return (
                      <div key={item.id} className="text-sm">
                        <div className="flex justify-between">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>${itemTotal}</span>
                        </div>
                      </div>
                    )
                  } else {
                    // Существующий код для обычных товаров
                    const itemTotal = item.price * item.quantity
                    const ammoTotal = item.ammoPrice && item.ammoQuantity ? item.ammoPrice * item.ammoQuantity : 0

                    return (
                      <div key={item.id} className="text-sm">
                        <div className="flex justify-between">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>${itemTotal}</span>
                        </div>
                        {ammoTotal > 0 && (
                          <div className="flex justify-between text-gray-600 ml-2">
                            <span>Патроны x{item.ammoQuantity}</span>
                            <span>${ammoTotal}</span>
                          </div>
                        )}
                      </div>
                    )
                  }
                })}

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Общая сумма:</span>
                  <span>${cartState.total}</span>
                </div>

                {!user && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Для оформления заказа необходимо{" "}
                      <Link href="/auth" className="underline font-semibold">
                        войти в систему
                      </Link>
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={!user || isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? "Оформляем заказ..." : "Оформить заказ"}
                </Button>

                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/catalog">Продолжить покупки</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
