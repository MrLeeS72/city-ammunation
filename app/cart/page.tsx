"use client"

import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

export default function Cart() {
  const { isAuthenticated } = useAuth()
  const { items, updateQuantity, updateAmmoQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const router = useRouter()

  if (!isAuthenticated) {
    router.push("/auth")
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-600">Корзина пуста</h1>
            <p className="text-gray-500 mb-8">Добавьте товары из каталога, чтобы оформить заказ</p>
            <Button onClick={() => router.push("/catalog")} className="bg-red-600 hover:bg-red-700">
              Перейти в каталог
            </Button>
          </div>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
        </footer>
      </div>
    )
  }

  const isFirearm = (category: string) => {
    return category !== "Покупка БЕЗ лицензии"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain bg-white rounded border flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">{item.category}</p>
                      <p className="text-red-600 font-bold">${item.price.toLocaleString()}</p>

                      {/* Количество товара */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Label className="text-sm">Количество:</Label>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Патроны для огнестрельного оружия */}
                      {isFirearm(item.category) && item.ammo && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">{item.ammo}</p>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Пачек патронов:</Label>
                            <Input
                              type="number"
                              min="0"
                              value={item.ammoQuantity || 0}
                              onChange={(e) => updateAmmoQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                              className="w-20 h-8"
                            />
                            <span className="text-sm text-gray-600">
                              × ${item.ammoPrice} = $
                              {((item.ammoQuantity || 0) * (item.ammoPrice || 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Оружие: ${(item.price * item.quantity).toLocaleString()}
                        </div>
                        {isFirearm(item.category) && item.ammoQuantity && item.ammoQuantity > 0 && (
                          <div className="text-sm text-gray-600">
                            Патроны: ${((item.ammoQuantity || 0) * (item.ammoPrice || 0)).toLocaleString()}
                          </div>
                        )}
                        <div className="text-lg font-bold text-red-600">
                          Итого: $
                          {(
                            item.price * item.quantity +
                            (item.ammoQuantity || 0) * (item.ammoPrice || 0)
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Итого по заказу</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Товаров:</span>
                  <span>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Пачек патронов:</span>
                  <span>{items.reduce((sum, item) => sum + (item.ammoQuantity || 0), 0)} шт.</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-red-600">
                  <span>Общая сумма:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => router.push("/order")}>
                    Оформить заказ
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/catalog")}>
                    Продолжить покупки
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={clearCart}>
                    Очистить корзину
                  </Button>
                </div>
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
