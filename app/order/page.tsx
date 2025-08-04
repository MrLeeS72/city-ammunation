"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react"
import { sendTelegramOrderAction } from "../actions/telegram"
import { addOrder as addOrderToServer } from "../actions/orders"

export default function Order() {
  const { isAuthenticated, user } = useAuth()
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isAuthenticated) {
    router.push("/auth")
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-gray-600">Корзина пуста</h1>
          <p className="text-gray-500 mb-8">Добавьте товары из каталога, чтобы оформить заказ</p>
          <Button onClick={() => router.push("/catalog")} className="bg-red-600 hover:bg-red-700">
            Перейти в каталог
          </Button>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
        </footer>
      </div>
    )
  }

  const orderData = {
    customerInfo: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      idCard: user?.idCard || "",
      discordNickname: user?.discordNickname || "",
    },
    items: items.map((item) => ({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      ammoQuantity: item.ammoQuantity || 0,
      ammoPrice: item.ammoPrice || 0,
      id: item.id,
      image: item.image,
    })),
    totalPrice: getTotalPrice(),
    orderDate: new Date().toLocaleString("ru-RU"),
  }

  const handleOrderSubmit = async () => {
    if (!user?.id) return // Убедимся, что user.id существует

    setIsSubmitting(true)
    setError(null)

    try {
      // Отправляем заказ в Telegram через Server Action
      const telegramResult = await sendTelegramOrderAction(orderData)

      if (!telegramResult.success) {
        setError(telegramResult.error || "Неизвестная ошибка при отправке заказа в Telegram.")
        return // Прерываем, если отправка в Telegram не удалась
      }

      // Если отправка в Telegram успешна, сохраняем заказ в базе данных
      const dbResult = await addOrderToServer(user.id, orderData) // Передаем user.id (UUID)

      if (dbResult.success) {
        alert("Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.")
        clearCart()
        router.push("/")
      } else {
        setError(dbResult.error || "Неизвестная ошибка при сохранении заказа в базе данных.")
      }
    } catch (err) {
      console.error("Order submission error (handleOrderSubmit):", err)
      setError(
        "Произошла техническая ошибка при оформлении заказа. Пожалуйста, проверьте консоль браузера для деталей.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Оформление заказа</h1>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Ошибка:</strong> {error}
              <br />
              <span className="text-sm">
                Пожалуйста, проверьте:
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Правильность токена бота Telegram и ID чата в переменных окружения Vercel.</li>
                  <li>Что ваш бот Telegram активен и имеет доступ к чату.</li>
                  <li>
                    Вкладку "Network" в инструментах разработчика вашего браузера (F12) для более подробной информации
                    об ошибке.
                  </li>
                  <li>
                    Настройки подключения к базе данных Neon (`DATABASE_URL`) и ключи Vercel Blob
                    (`BLOB_READ_WRITE_TOKEN`).
                  </li>
                </ul>
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Данные покупателя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Имя:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p>
                <strong>Телефон:</strong> {user?.phone}
              </p>
              <p>
                <strong>ID карта:</strong> {user?.idCard}
              </p>
              <p>
                <strong>Discord:</strong> {user?.discordNickname}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {item.name} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.ammoQuantity && item.ammoQuantity > 0 && (
                      <div className="flex justify-between text-sm text-gray-600 ml-4">
                        <span>+ Патроны x{item.ammoQuantity} пачек</span>
                        <span>${((item.ammoQuantity || 0) * (item.ammoPrice || 0)).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Итого:</span>
                  <span className="text-red-600">${getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 space-y-4">
          <p className="text-gray-600">
            После оформления заказа с вами свяжется наш менеджер для подтверждения деталей.
          </p>

          <div className="space-x-4">
            <Button
              onClick={handleOrderSubmit}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 px-8 py-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Оформляем заказ...
                </>
              ) : (
                "Подтвердить заказ"
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push("/cart")} disabled={isSubmitting}>
              Вернуться в корзину
            </Button>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
