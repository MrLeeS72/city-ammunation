"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "../contexts/AuthContext"

export default function Header() {
  const { getTotalItems } = useCart()
  const { user, logout } = useAuth()

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-red-600 mr-6">
          Ammu-Nation
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/catalog" className="hover:text-red-600 transition-colors">
            Каталог
          </Link>
          <Link href="/shooting-range" className="hover:text-red-600 transition-colors">
            Тир
          </Link>
          <Link href="/licensing" className="hover:text-red-600 transition-colors">
            Лицензирование
          </Link>
          <Link href="/contacts" className="hover:text-red-600 transition-colors">
            Контакты
          </Link>
          <Link href="/vacancies" className="hover:text-red-600 transition-colors">
            Вакансии
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" className="relative">
          <Link href="/cart">
            <ShoppingCart className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </Button>
        {user ? (
          <Button asChild variant="ghost">
            <Link href="/profile">
              <User className="h-6 w-6" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="ghost">
            <Link href="/auth">
              <User className="h-6 w-6" />
            </Link>
          </Button>
        )}
        {user && (
          <Button variant="ghost" onClick={logout} className="hidden md:inline-flex">
            Выйти
          </Button>
        )}

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-800 text-white w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 p-4">
              <Link href="/catalog" className="hover:text-red-600 transition-colors text-lg" onClick={() => {}}>
                Каталог
              </Link>
              <Link href="/shooting-range" className="hover:text-red-600 transition-colors text-lg" onClick={() => {}}>
                Тир
              </Link>
              <Link href="/licensing" className="hover:text-red-600 transition-colors text-lg" onClick={() => {}}>
                Лицензирование
              </Link>
              <Link href="/contacts" className="hover:text-red-600 transition-colors text-lg" onClick={() => {}}>
                Контакты
              </Link>
              <Link href="/vacancies" className="hover:text-red-600 transition-colors text-lg" onClick={() => {}}>
                Вакансии
              </Link>
              {user && (
                <Button variant="ghost" onClick={logout} className="justify-start p-0 text-lg hover:text-red-600">
                  Выйти
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
