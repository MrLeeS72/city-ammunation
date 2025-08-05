"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function Header() {
  const { state: cartState } = useCart()
  const { user, logout } = useAuth()

  const cartItemsCount = cartState.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-black text-white p-4 sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-red-600">
          City Ammu-Nation
        </Link>

        <ul className="flex space-x-4 items-center">
          <li>
            <Link href="/" className="hover:text-red-600 transition-colors">
              Главная
            </Link>
          </li>
          <li>
            <Link href="/catalog" className="hover:text-red-600 transition-colors">
              Каталог
            </Link>
          </li>
          <li>
            <Link href="/licensing" className="hover:text-red-600 transition-colors">
              Лицензирование
            </Link>
          </li>
          <li>
            <Link href="/shooting-range" className="hover:text-red-600 transition-colors">
              Тир
            </Link>
          </li>
          <li>
            <Link href="/vacancies" className="hover:text-red-600 transition-colors">
              Вакансии
            </Link>
          </li>
          <li>
            <Link href="/contacts" className="hover:text-red-600 transition-colors">
              Контакты
            </Link>
          </li>

          {/* Cart Icon */}
          <li>
            <Link href="/cart" className="relative hover:text-red-600 flex items-center transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </li>

          {/* User Menu */}
          <li>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:text-red-600 hover:bg-transparent flex items-center space-x-2"
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt="Аватар"
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                    <span>{`${user.firstName} ${user.lastName}`.trim()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="hover:text-red-600 transition-colors">
                Войти
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}
