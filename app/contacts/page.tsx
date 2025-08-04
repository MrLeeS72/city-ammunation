import Header from "../components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import Image from "next/image"

export default function Contacts() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Контакты</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-red-600" />
                Наш адрес
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Центральный офис "Ammu-Nation"
                <br />
                Cypress Flats, Popular Street, 9275
                <br />
                Лос-Сантос, Сан-Андреас
              </p>
              <div className="mt-4 rounded-lg overflow-hidden">
                <Image
                  src="/public/images/los-santos-detailed-map.png"
                  alt="Карта Лос-Сантоса"
                  width={600}
                  height={400}
                  layout="responsive"
                  objectFit="cover"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-red-600" />
                  Телефон
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Общие вопросы: +1 (555) 123-4567</p>
                <p className="text-gray-700">Поддержка: +1 (555) 987-6543</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-red-600" />
                  Электронная почта
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Общие вопросы: info@ammunation.com</p>
                <p className="text-gray-700">Поддержка: support@ammunation.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-red-600" />
                  Часы работы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Понедельник - Пятница: 9:00 - 20:00</p>
                <p className="text-gray-700">Суббота: 10:00 - 18:00</p>
                <p className="text-gray-700">Воскресенье: Выходной</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
