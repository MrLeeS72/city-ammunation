import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "./components/Header"
import { DbConnectionTest } from "./components/DbConnectionTest" // Импортируем компонент для проверки БД

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center h-[600px] flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center p-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">Добро пожаловать в City Ammu-Nation</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
              Ваш надежный поставщик оружия, боеприпасов и снаряжения в Лос-Сантосе.
            </p>
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-12 text-red-600">Наши услуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Широкий ассортимент</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    От пистолетов до тяжелого вооружения, у нас есть все, что вам нужно для самообороны или выполнения
                    миссий.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Тир</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Отточите свои навыки стрельбы в нашем современном тире под руководством опытных инструкторов.
                  </p>
                  <Button asChild variant="link" className="mt-4 text-red-600 hover:text-red-700">
                    <Link href="/shooting-range">Подробнее</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Лицензирование</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Помощь в получении и продлении лицензий на оружие, а также консультации по законодательству.
                  </p>
                  <Button asChild variant="link" className="mt-4 text-red-600 hover:text-red-700">
                    <Link href="/licensing">Подробнее</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-red-600">Найдите нас на карте</h2>
            <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/public/images/los-santos-detailed-map.png"
                alt="Карта Лос-Сантоса с расположением Ammu-Nation"
                width={1000}
                height={600}
                layout="responsive"
                objectFit="cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-md">
                <p className="font-semibold">Наш адрес:</p>
                <p>Бульвар Вайнвуд, Лос-Сантос</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-red-700 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4">Готовы к покупкам?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Посетите наш онлайн-каталог или свяжитесь с нами для получения дополнительной информации.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                asChild
                className="bg-white text-red-700 hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Link href="/catalog">Перейти в каталог</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-700 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 bg-transparent"
              >
                <Link href="/contacts">Связаться с нами</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Добавляем компонент для проверки подключения к БД */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <DbConnectionTest />
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
