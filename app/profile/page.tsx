"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "../components/Header"
import { useAuth } from "../contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { getProfileByUserId, updateProfile, getOrdersByUserId } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface ProfileData {
  username: string | null
  full_name: string | null
  phone_number: string | null
  address: string | null
}

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price_at_purchase: number
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [orderPlacedMessage, setOrderPlacedMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      if (user) {
        // Fetch profile
        setLoadingProfile(true)
        const profileResult = await getProfileByUserId(user.id)
        if (profileResult.success && profileResult.profile) {
          setProfile(profileResult.profile)
        } else if (profileResult.error) {
          setProfileError(profileResult.error)
        }
        setLoadingProfile(false)

        // Fetch orders
        setLoadingOrders(true)
        const ordersResult = await getOrdersByUserId(user.id)
        if (ordersResult.success) {
          setOrders(ordersResult.orders)
        } else if (ordersResult.error) {
          setOrderError(ordersResult.error)
        }
        setLoadingOrders(false)
      }
    }

    fetchProfileAndOrders()
  }, [user])

  useEffect(() => {
    if (searchParams.get("orderPlaced") === "true") {
      setOrderPlacedMessage("Ваш заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.")
      // Clear the query parameter after displaying the message
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete("orderPlaced")
      router.replace(`/profile?${newSearchParams.toString()}`, { shallow: true })
    }
  }, [searchParams, router])

  const handleUpdateProfile = async (formData: FormData) => {
    if (!user) return

    setUpdateLoading(true)
    setProfileError(null)
    try {
      const result = await updateProfile(user.id, formData)
      if (result.success && result.profile) {
        setProfile(result.profile)
        setIsEditing(false)
      } else {
        setProfileError(result.error || "Не удалось обновить профиль.")
      }
    } catch (error: any) {
      setProfileError(error.message || "Произошла непредвиденная ошибка.")
    } finally {
      setUpdateLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <p className="ml-2 text-gray-700">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Профиль пользователя</h1>

        {orderPlacedMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{orderPlacedMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setOrderPlacedMessage(null)}>
              <svg
                className="fill-current h-6 w-6 text-green-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Личные данные</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProfile ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                  <p className="ml-2 text-gray-700">Загрузка профиля...</p>
                </div>
              ) : profileError ? (
                <p className="text-red-500">{profileError}</p>
              ) : (
                <form action={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email || ""} disabled className="bg-gray-200" />
                  </div>
                  <div>
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      defaultValue={profile?.username || ""}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Полное имя</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      defaultValue={profile?.full_name || ""}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Номер телефона</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      defaultValue={profile?.phone_number || ""}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      defaultValue={profile?.address || ""}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={updateLoading}>
                          {updateLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Сохранение...
                            </>
                          ) : (
                            "Сохранить"
                          )}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} disabled={updateLoading}>
                          Отмена
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="bg-red-600 hover:bg-red-700">
                        Редактировать
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Мои заказы</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                  <p className="ml-2 text-gray-700">Загрузка заказов...</p>
                </div>
              ) : orderError ? (
                <p className="text-red-500">{orderError}</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-700">У вас пока нет заказов.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Заказ #{order.id.substring(0, 8)}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status === "pending"
                            ? "В обработке"
                            : order.status === "completed"
                              ? "Выполнен"
                              : order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Дата: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold text-gray-800 mb-2">
                        Сумма: ${order.total_amount.toLocaleString()}
                      </p>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium mb-1">Товары:</p>
                        <ul className="list-disc list-inside ml-4">
                          {order.order_items.map((item, idx) => (
                            <li key={idx}>
                              {item.product_name} (x{item.quantity}) - ${item.price_at_purchase.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
