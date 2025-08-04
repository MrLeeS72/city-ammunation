import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "../components/Header"

export default function ShootingRange() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Тир Ammu-Nation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Пистолеты</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Отточите свои навыки стрельбы из пистолета на наших специально оборудованных дорожках. Идеально для
                новичков и опытных стрелков.
              </p>
              <ul className="list-disc list-inside text-left text-gray-600 mb-4">
                <li>Дорожка: $50/час</li>
                <li>Патроны: от $10/пачка</li>
                <li>Аренда пистолета: $20</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Забронировать</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Дробовики</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Почувствуйте мощь дробовика. Наши дорожки подходят для стрельбы по мишеням и отработки тактических
                навыков.
              </p>
              <ul className="list-disc list-inside text-left text-gray-600 mb-4">
                <li>Дорожка: $75/час</li>
                <li>Патроны: от $15/пачка</li>
                <li>Аренда дробовика: $30</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Забронировать</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Автоматы и винтовки</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Для тех, кто ищет серьезные испытания. Доступны различные калибры и типы оружия.
              </p>
              <ul className="list-disc list-inside text-left text-gray-600 mb-4">
                <li>Дорожка: $100/час</li>
                <li>Патроны: от $20/пачка</li>
                <li>Аренда автомата/винтовки: $50</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Забронировать</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Правила посещения</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Для посещения тира необходимо иметь действующую лицензию на оружие или пройти вводный инструктаж с нашим
            специалистом. Все посетители должны соблюдать правила безопасности.
          </p>
          <Button asChild variant="outline" className="mt-6 bg-transparent">
            <Link href="/licensing">Узнать о лицензировании</Link>
          </Button>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
