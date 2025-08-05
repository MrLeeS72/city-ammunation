"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon, ShoppingCartIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"

export default function Header() {
  const { cart } = useCart()
  const { user, logout } = useAuth()

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" href="/">
          <Image src="/placeholder-logo.png" alt="City Ammu-Nation Logo" width={40} height={40} />
          <span className="text-lg font-semibold">City Ammu-Nation</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link className="font-medium hover:text-red-400" href="/catalog">
            Каталог
          </Link>
          <Link className="font-medium hover:text-red-400" href="/shooting-range">
            Тир
          </Link>
          <Link className="font-medium hover:text-red-400" href="/licensing">
            Лицензирование
          </Link>
          <Link className="font-medium hover:text-red-400" href="/contacts">
            Контакты
          </Link>
          <Link className="font-medium hover:text-red-400" href="/vacancies">
            Вакансии
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-gray-700">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="sr-only">Корзина</span>
            </Button>
            {totalItemsInCart > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {totalItemsInCart}
              </span>
            )}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                <UserIcon className="h-6 w-6" />
                <span className="sr-only">Профиль пользователя</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800">
              {user ? (
                <>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/profile">Мой профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    Выйти
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/auth">Войти / Зарегистрироваться</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Переключить навигацию</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 text-white">
              <Link className="flex items-center gap-2 mb-6" href="/">
                <Image src="/placeholder-logo.png" alt="City Ammu-Nation Logo" width={40} height={40} />
                <span className="text-lg font-semibold">City Ammu-Nation</span>
              </Link>
              <nav className="grid gap-4 text-lg">
                <Link className="font-medium hover:text-red-400" href="/catalog">
                  Каталог
                </Link>
                <Link className="font-medium hover:text-red-400" href="/shooting-range">
                  Тир
                </Link>
                <Link className="font-medium hover:text-red-400" href="/licensing">
                  Лицензирование
                </Link>
                <Link className="font-medium hover:text-red-400" href="/contacts">
                  Контакты
                </Link>
                <Link className="font-medium hover:text-red-400" href="/vacancies">
                  Вакансии
                </Link>
                {user ? (
                  <>
                    <Link className="font-medium hover:text-red-400" href="/profile">
                      Мой профиль
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start pl-0 text-white hover:text-red-400"
                      onClick={logout}
                    >
                      Выйти
                    </Button>
                  </>
                ) : (
                  <Link className="font-medium hover:text-red-400" href="/auth">
                    Войти / Зарегистрироваться
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
