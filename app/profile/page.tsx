"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, XIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const availableLicenses = [
  "Лицензия на оружие",
  "Лицензия на вождение",
  "Лицензия на рыболовство",
  "Лицензия на охоту",
  "Лицензия на такси",
  "Лицензия на адвокатскую деятельность",
  "Лицензия на медицинскую деятельность",
]

export default function ProfilePage() {
  const { user, orders, loading, error, updateProfile, addLicense, removeLicense } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [idCard, setIdCard] = useState("")
  const [discord, setDiscord] = useState("")
  const [selectedLicense, setSelectedLicense] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setIdCard(user.idCard || "")
      setDiscord(user.postalCode || "")
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess(null)
    const success = await updateProfile({ firstName, lastName, idCard, postalCode: discord })
    setIsUpdating(false)
    if (success) {
      setUpdateSuccess("Профиль успешно обновлен!")
    }
  }

  const handleAddLicense = async () => {
    if (selectedLicense && user && !user.licenses.includes(selectedLicense)) {
      setIsUpdating(true)
      setUpdateSuccess(null)
      const success = await addLicense(selectedLicense)
      setIsUpdating(false)
      if (success) {
        setUpdateSuccess("Лицензия успешно добавлена!")
        setSelectedLicense("") // Clear selection
      }
    }
  }

  const handleRemoveLicense = async (licenseToRemove: string) => {
    setIsUpdating(true)
    setUpdateSuccess(null)
    const success = await removeLicense(licenseToRemove)
    setIsUpdating(false)
    if (success) {
      setUpdateSuccess("Лицензия успешно удалена!")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Необходимо войти</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Пожалуйста, войдите в систему, чтобы просмотреть свой профиль.</p>
            <Button onClick={() => (window.location.href = "/auth")}>Перейти к входу</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Профиль пользователя</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {updateSuccess && (
        <Alert className="mb-4">
          <AlertTitle>Успех</AlertTitle>
          <AlertDescription>{updateSuccess}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Секция информации о профиле */}
        <Card>
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" type="tel" value={user.phone} disabled className="bg-gray-100 dark:bg-gray-800" />
              </div>
              <div>
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  type="text"
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="idCard">ID-карта</Label>
                <Input
                  id="idCard"
                  type="text"
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  placeholder="XXXX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="discord">Discord</Label>
                <Input
                  id="discord"
                  type="text"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="ваш_никнейм#1234"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  "Сохранить изменения"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Секция лицензий */}
        <Card>
          <CardHeader>
            <CardTitle>Лицензии</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="add-license">Добавить новую лицензию</Label>
              <div className="flex gap-2">
                <Select onValueChange={setSelectedLicense} value={selectedLicense}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Выберите лицензию" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLicenses
                      .filter((license) => !user.licenses.includes(license))
                      .map((license) => (
                        <SelectItem key={license} value={license}>
                          {license}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddLicense} disabled={!selectedLicense || isUpdating}>
                  Добавить
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Выберите лицензию из списка, чтобы добавить ее. Чтобы удалить лицензию, нажмите "X" рядом с ней.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Имеющиеся лицензии:</h3>
              {user.licenses.length === 0 ? (
                <p className="text-gray-500">У вас пока нет лицензий.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.licenses.map((license) => (
                    <div
                      key={license}
                      className="flex items-center rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {license}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLicense(license)}
                        className="ml-2 h-auto p-0 text-blue-800 hover:bg-transparent hover:text-blue-900 dark:text-blue-200 dark:hover:text-blue-100"
                        aria-label={`Удалить лицензию ${license}`}
                        disabled={isUpdating}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Секция истории заказов */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>История заказов</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-500">У вас пока нет заказов.</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {orders.map((order) => (
                  <AccordionItem key={order.id} value={order.id}>
                    <AccordionTrigger className="flex justify-between items-center py-4 text-base font-medium hover:no-underline">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full text-left">
                        <span className="font-semibold">Заказ #{order.id.substring(0, 8)}</span>
                        <span>{new Date(order.createdAt).toLocaleDateString("ru-RU")}</span>
                        <span>Сумма: ${order.total}</span>
                        <span>Статус: {order.status}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Детали заказа:</h4>
                        <ul className="list-disc pl-5">
                          {order.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              {item.name} (x{item.quantity}) - ${item.price} за шт.
                              {item.ammoQuantity && item.ammoPrice && (
                                <>
                                  , Патроны: {item.ammoQuantity} пачек по ${item.ammoPrice}
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                        {order.telegramMessageId && (
                          <p className="text-sm text-gray-600">ID сообщения в Telegram: {order.telegramMessageId}</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
