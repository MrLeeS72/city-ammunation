"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/app/context/CartContext"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import { X } from "lucide-react"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, updateAmmoQuantity, clearCart } = useCart()
  const router = useRouter()

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      const ammoTotal = (item.ammoPrice || 0) * (item.ammoQuantity || 0)
      return sum + itemTotal + ammoTotal
    }, 0)
  }

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = Number.parseInt(value)
    if (!isNaN(quantity)) {
      updateQuantity(id, quantity)
    }
  }

  const handleAmmoQuantityChange = (id: string, value: string) => {
    const ammoQuantity = Number.parseInt(value)
    if (!isNaN(ammoQuantity)) {
      updateAmmoQuantity(id, ammoQuantity)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Ваша корзина</h1>

          {cart.length === 0 ? (
            <Card className="w-full text-center">
              <CardHeader>
                <CardTitle>Корзина пуста</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Добавьте товары в корзину, чтобы оформить заказ.</p>
                <Button onClick={() => router.push("/catalog")}>Перейти в каталог</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600 text-sm">${item.price.toFixed(2)} за шт.</p>
                          {item.ammoPrice && (
                            <p className="text-gray-600 text-sm">Патроны: ${item.ammoPrice.toFixed(2)} за пачку</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`quantity-${item.id}`} className="sr-only">
                              Количество
                            </Label>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="w-20 text-center"
                            />
                            <span className="text-gray-600">шт.</span>
                          </div>
                          {item.ammoQuantity !== undefined && item.ammoPrice !== undefined && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Label htmlFor={`ammo-quantity-${item.id}`} className="sr-only">
                                Патроны
                              </Label>
                              <Input
                                id={`ammo-quantity-${item.id}`}
                                type="number"
                                min="0"
                                value={item.ammoQuantity}
                                onChange={(e) => handleAmmoQuantityChange(item.id, e.target.value)}
                                className="w-20 text-center"
                              />
                              <span className="text-gray-600">пачек</span>
                            </div>
                          )}
                        </div>
                        <div className="font-semibold text-lg">
                          ${(item.price * item.quantity + (item.ammoPrice || 0) * (item.ammoQuantity || 0)).toFixed(2)}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                          <X className="h-5 w-5 text-red-600" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 p-6 border-t">
                <div className="flex justify-between items-center w-full font-bold text-xl">
                  <span>Итого:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    Очистить корзину
                  </Button>
                  <Button onClick={() => router.push("/order")} className="flex-1 bg-red-600 hover:bg-red-700">
                    Оформить заказ
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
