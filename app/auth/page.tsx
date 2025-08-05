"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [idCard, setIdCard] = useState("")
  const [discord, setDiscord] = useState("")
  const { login, register, loading, error } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let success = false
    if (isRegistering) {
      success = await register({ firstName, lastName, phone, idCard, postalCode: discord })
    } else {
      success = await login(phone)
    }

    if (success) {
      router.push("/profile")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{isRegistering ? "Регистрация" : "Вход"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Иван"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Иванов"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (XXX) XXX-XX-XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {isRegistering && (
              <>
                <div>
                  <Label htmlFor="idCard">ID-карта (необязательно)</Label>
                  <Input
                    id="idCard"
                    type="text"
                    placeholder="XXXX-XXXX"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="discord">Discord (необязательно)</Label>
                  <Input
                    id="discord"
                    type="text"
                    placeholder="ваш_никнейм#1234"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                  />
                </div>
              </>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : isRegistering ? (
                "Зарегистрироваться"
              ) : (
                "Войти"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isRegistering ? (
              <>
                Уже есть аккаунт?{" "}
                <Button variant="link" onClick={() => setIsRegistering(false)} className="p-0 h-auto">
                  Войти
                </Button>
              </>
            ) : (
              <>
                Нет аккаунта?{" "}
                <Button variant="link" onClick={() => setIsRegistering(true)} className="p-0 h-auto">
                  Зарегистрироваться
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
