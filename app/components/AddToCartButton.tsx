"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/CartContext"
import { toast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
  name: string
  price: number
  quantity: number
  ammoQuantity?: number
  ammoPrice?: number
}

export function AddToCartButton({ productId, name, price, quantity, ammoQuantity, ammoPrice }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (quantity <= 0) {
      toast({
        title: "Ошибка",
        description: "Количество должно быть больше 0.",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: productId,
      name,
      price,
      quantity,
      ammoQuantity,
      ammoPrice,
    })
    toast({
      title: "Добавлено в корзину",
      description: `${quantity}x ${name} ${ammoQuantity ? `и ${ammoQuantity} пачек патронов` : ""}`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className="w-full bg-red-600 hover:bg-red-700">
      Добавить в корзину
    </Button>
  )
}
