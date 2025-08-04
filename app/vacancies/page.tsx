import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "../components/Header"

export default function Vacancies() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Вакансии в Ammu-Nation</h1>

        <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          Присоединяйтесь к нашей команде! Мы ищем талантливых и ответственных сотрудников, готовых работать в
          динамичной среде.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Продавец-консультант</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Консультирование клиентов по ассортименту оружия и боеприпасов, помощь в выборе, оформление продаж.
              </p>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Требования:</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Опыт работы в продажах.</li>
                <li>Знание ассортимента оружия (желательно).</li>
                <li>Ответственность, коммуникабельность.</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Подать заявку</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Инструктор тира</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Проведение инструктажей по безопасности, обучение клиентов стрельбе, контроль за соблюдением правил в
                тире.
              </p>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Требования:</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Опыт работы инструктором.</li>
                <li>Сертификаты по безопасности оружия.</li>
                <li>Отличные коммуникативные навыки.</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Подать заявку</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Специалист по лицензированию</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Помощь клиентам в сборе и оформлении документов для получения лицензий на оружие, консультации по
                законодательству.
              </p>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Требования:</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Юридическое образование (желательно).</li>
                <li>Знание законодательства об оружии.</li>
                <li>Внимательность к деталям.</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Подать заявку</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Почему стоит работать у нас?</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Мы предлагаем конкурентную заработную плату, возможности для карьерного роста, дружный коллектив и работу в
            уникальной сфере.
          </p>
          <Button asChild variant="outline" className="mt-6 bg-transparent">
            <Link href="/contacts">Связаться с отделом кадров</Link>
          </Button>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
