import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
// import { OrderHistoryProvider } from "./contexts/OrderHistoryContext" // Удаляем импорт OrderHistoryProvider

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "City Ammu-Nation",
  description: "Каталог оружия и аксессуаров Ammu-Nation",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <AuthProvider>
          <CartProvider>
            {/* <OrderHistoryProvider>{children}</OrderHistoryProvider> */} {/* Удаляем OrderHistoryProvider */}
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
