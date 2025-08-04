"use client"

import { useRouter } from "next/navigation"
import { useCart } from "../contexts/CartContext"
import Header from "../components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"

export default function Cart() {
  const { items, removeItem, updateItemQuantity, updateItemAmmoQuantity, getTotalPrice } = useCart()
  const router = useRouter()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateItemQuantity(id, newQuantity)
    }
  }

  const handleAmmoQuantityChange = (id: string, newAmmoQuantity: number) => {
    if (newAmmoQuantity >= 0) {
      updateItemAmmoQuantity(id, newAmmoQuantity)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Ваша корзина</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 mb-4">Ваша корзина пуста.</p>
            <Button onClick={() => router.push("/catalog")} className="bg-red-600 hover:bg-red-700">
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 shadow-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="object-contain rounded-md mr-4 flex-shrink-0"
                  />
                  <div className="flex-grow text-center sm:text-left mt-4 sm:mt-0">
                    <h2 className="text-xl font-bold text-red-700">{item.name}</h2>
                    <p className="text-gray-600">${item.price.toLocaleString()} за шт.</p>
                    {item.ammoPrice !== undefined && (
                      <p className="text-gray-600 text-sm">Патроны: ${item.ammoPrice.toLocaleString()} за пачку</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0 sm:ml-auto">
                    <div className="flex items-center space-x-2 mb-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                        className="w-20 text-center"
                        min="0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {item.ammoPrice !== undefined && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Label htmlFor={`ammo-quantity-${item.id}`} className="text-sm text-gray-700">
                          Патроны:
                        </Label>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAmmoQuantityChange(item.id, (item.ammoQuantity || 0) - 1)}
                          disabled={(item.ammoQuantity || 0) <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`ammo-quantity-${item.id}`}
                          type="number"
                          value={item.ammoQuantity || 0}
                          onChange={(e) => handleAmmoQuantityChange(item.id, Number.parseInt(e.target.value))}
                          className="w-20 text-center"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAmmoQuantityChange(item.id, (item.ammoQuantity || 0) + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-lg font-bold text-red-600 mt-2">
                      Итого: $
                      {(item.price * item.quantity + (item.ammoQuantity || 0) * (item.ammoPrice || 0)).toLocaleString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-500 mt-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="lg:col-span-1 h-fit sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600">Итого по корзине</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-700">
                      <span>
                        {item.name} x{item.quantity}
                        {item.ammoQuantity && item.ammoQuantity > 0 && ` (+${item.ammoQuantity} пач. патронов)`}
                      </span>
                      <span>
                        $
                        {(
                          item.price * item.quantity +
                          (item.ammoQuantity || 0) * (item.ammoPrice || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between items-center font-bold text-xl">
                  <span>Общая сумма:</span>
                  <span className="text-red-600">${getTotalPrice().toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => router.push("/order")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
                >
                  Оформить заказ
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
