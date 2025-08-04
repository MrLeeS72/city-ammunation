"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "../components/Header"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createOrder } from "@/app/actions/orders"
import { sendOrderConfirmationToTelegram } from "@/app/actions/telegram"
import { Loader2 } from "lucide-react"

export default function OrderPage() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth") // Redirect to login if not authenticated
    }
    if (cart.length === 0 && !orderSuccess) {
      router.push("/cart") // Redirect to cart if it's empty and no order was just placed
    }
  }, [user, authLoading, cart, router, orderSuccess])

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return

    setIsProcessing(true)
    setOrderError(null)

    try {
      const itemsForOrder = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
      const totalAmount = getTotalPrice()

      const result = await createOrder(user.id, itemsForOrder, totalAmount)

      if (result.success) {
        setOrderSuccess(true)
        clearCart() // Clear cart after successful order
        await sendOrderConfirmationToTelegram(
          result.orderId!,
          totalAmount,
          cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        )
        router.push("/profile?orderPlaced=true") // Redirect to profile with success message
      } else {
        setOrderError(result.error || "Не удалось оформить заказ.")
      }
    } catch (error: any) {
      setOrderError(error.message || "Произошла непредвиденная ошибка при оформлении заказа.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (authLoading || !user || (cart.length === 0 && !orderSuccess)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <p className="ml-2 text-gray-700">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center text-gray-700">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4 mt-4 flex justify-between text-xl font-bold text-gray-800">
                <span>Итого:</span>
                <span>${getTotalPrice().toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Подтверждение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Пожалуйста, проверьте детали вашего заказа. После подтверждения, ваш заказ будет обработан.
              </p>
              {orderError && <p className="text-red-500 text-sm">{orderError}</p>}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Оформление...
                  </>
                ) : (
                  "Подтвердить и оплатить"
                )}
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
