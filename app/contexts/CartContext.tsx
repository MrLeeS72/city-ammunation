"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  image: string
  ammoQuantity?: number // Количество пачек патронов
  ammoPrice?: number // Цена за пачку патронов
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number, ammoQuantity?: number) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  updateItemAmmoQuantity: (id: string, ammoQuantity: number) => void
  getTotalPrice: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("ammu-nation-cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ammu-nation-cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1, ammoQuantity = 0) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                ammoQuantity: i.ammoQuantity !== undefined ? i.ammoQuantity + ammoQuantity : ammoQuantity,
              }
            : i,
        )
      } else {
        return [...prevItems, { ...item, quantity, ammoQuantity }]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0),
    )
  }

  const updateItemAmmoQuantity = (id: string, ammoQuantity: number) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, ammoQuantity } : item)))
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity
      const ammoTotal = (item.ammoQuantity || 0) * (item.ammoPrice || 0)
      return total + itemTotal + ammoTotal
    }, 0)
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        updateItemAmmoQuantity,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
