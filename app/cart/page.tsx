"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "../contexts/CartContext"
import Header from "../components/Header"
import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Ваша корзина</h1>

        {cart.length === 0 ? (
          <Card className="max-w-md mx-auto text-center p-8">
            <CardTitle className="text-2xl mb-4">Корзина пуста</CardTitle>
            <CardContent>
              <p className="text-gray-700 mb-6">Похоже, вы еще ничего не добавили в корзину.</p>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/catalog">Перейти в каталог</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="flex items-center p-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-contain mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-red-600">{item.name}</h2>
                    <p className="text-gray-700">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                onClick={clearCart}
              >
                Очистить корзину
              </Button>
            </div>

            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600">Итог заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Всего товаров:</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-800">
                  <span>Общая сумма:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3">
                  <Link href="/order">Оформить заказ</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
