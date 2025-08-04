import { Suspense } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

// Placeholder for user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user_12345"

async function ProfileContent() {
  const { success: profileSuccess, profile } = await api.profile.get(MOCK_USER_ID)
  const { success: ordersSuccess, orders } = await api.orders.get(MOCK_USER_ID)

  if (!profileSuccess || !profile) {
    return <div className="text-center text-red-500">Не удалось загрузить профиль.</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Мой профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder-user.jpg" alt="Аватар пользователя" />
              <AvatarFallback>
                {profile.username ? profile.username.substring(0, 2).toUpperCase() : "NN"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.username || "Неизвестный пользователь"}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Имя</Label>
              <Input id="firstName" value={profile.firstName || ""} readOnly />
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <Input id="lastName" value={profile.lastName || ""} readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" value={profile.phone || ""} readOnly />
            </div>
            <div>
              <Label htmlFor="discord">Discord</Label>
              <Input id="discord" value={profile.discordNickname || ""} readOnly />
            </div>
          </div>
          <Button className="w-full">Редактировать профиль</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История заказов</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersSuccess && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Заказ #{order.id.substring(0, 8)}</h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(order.created_at), "dd.MM.yyyy HH:mm")}
                    </span>
                  </div>
                  <p className="text-lg font-bold mb-2">Итого: ${order.total_amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Статус: {order.status}</p>
                  <div className="mt-2 space-y-1">
                    <h4 className="font-medium">Товары:</h4>
                    {order.order_items.map((item: any, index: number) => (
                      <p key={index} className="text-sm text-gray-700">
                        {item.product_name} (x{item.quantity}) - ${item.price_at_purchase.toFixed(2)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">У вас пока нет заказов.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}
