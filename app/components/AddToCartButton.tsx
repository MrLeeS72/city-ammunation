"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "../context/CartContext"
import { toast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  item: {
    id: string
    name: string
    price: number
    image: string
    category: string
    ammoPrice?: number
    ammoPackSize?: number
  }
  isAmmoOnly?: boolean
}

export default function AddToCartButton({ item, isAmmoOnly }: AddToCartButtonProps) {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: item })
    const toastDescription = isAmmoOnly ? `${item.name} добавлены в корзину` : `${item.name} добавлен в корзину`
    toast({
      title: "Товар добавлен в корзину",
      description: toastDescription,
    })
  }

  const buttonText = isAmmoOnly ? "Патроны в корзину" : "В корзину"

  return (
    <Button onClick={handleAddToCart} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
      <ShoppingCart className="h-4 w-4 mr-1" />
      {buttonText}
    </Button>
  )
}
