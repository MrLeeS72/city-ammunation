"use client"

import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { ShoppingCart, User, LogOut, UserCircle } from "lucide-react" // Добавляем UserCircle
import { Button } from "@/components/ui/button"

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const { getTotalItems } = useCart()

  return (
    <header className="bg-black text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-red-600">
          City Ammu-Nation
        </Link>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link href="/" className="hover:text-red-600">
              Главная
            </Link>
          </li>
          <li>
            <Link href="/catalog" className="hover:text-red-600">
              Каталог
            </Link>
          </li>
          <li>
            <Link href="/licensing" className="hover:text-red-600">
              Лицензирование
            </Link>
          </li>
          <li>
            <Link href="/shooting-range" className="hover:text-red-600">
              Тир
            </Link>
          </li>
          <li>
            <Link href="/vacancies" className="hover:text-red-600">
              Вакансии
            </Link>
          </li>
          <li>
            <Link href="/contacts" className="hover:text-red-600">
              Контакты
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <Link href="/cart" className="hover:text-red-600 flex items-center relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-red-600 flex items-center">
                  <UserCircle className="h-5 w-5" />
                  <span className="ml-1 hidden sm:inline">Профиль</span>
                </Link>
              </li>
            </>
          )}

          {isAuthenticated ? (
            <li className="flex items-center space-x-2">
              <span className="flex items-center text-sm">
                <User className="h-4 w-4 mr-1" />
                {user?.firstName} {user?.lastName}
              </span>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-white hover:text-red-600 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </li>
          ) : (
            <li>
              <Link href="/auth" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                Войти
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
