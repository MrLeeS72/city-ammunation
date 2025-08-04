"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const pathname = usePathname()
  const { items } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">
          City Ammu-Nation
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link
            href="/catalog"
            className={`hover:text-red-500 transition-colors ${
              pathname === "/catalog" ? "text-red-500 font-semibold" : ""
            }`}
          >
            Каталог
          </Link>
          <Link
            href="/shooting-range"
            className={`hover:text-red-500 transition-colors ${
              pathname === "/shooting-range" ? "text-red-500 font-semibold" : ""
            }`}
          >
            Тир
          </Link>
          <Link
            href="/licensing"
            className={`hover:text-red-500 transition-colors ${
              pathname === "/licensing" ? "text-red-500 font-semibold" : ""
            }`}
          >
            Лицензирование
          </Link>
          <Link
            href="/contacts"
            className={`hover:text-red-500 transition-colors ${
              pathname === "/contacts" ? "text-red-500 font-semibold" : ""
            }`}
          >
            Контакты
          </Link>
          <Link
            href="/vacancies"
            className={`hover:text-red-500 transition-colors ${
              pathname === "/vacancies" ? "text-red-500 font-semibold" : ""
            }`}
          >
            Вакансии
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-red-600">
                    <AvatarImage
                      src={user?.profilePictureUrl || "/placeholder.svg?height=36&width=36&query=user avatar"}
                      alt="Аватар пользователя"
                    />
                    <AvatarFallback className="bg-red-100 text-red-600">{user?.firstName?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.discordNickname}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="text-white hover:bg-gray-700">
              <Link href="/auth">
                <LogIn className="h-6 w-6 mr-2" />
                Войти
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
