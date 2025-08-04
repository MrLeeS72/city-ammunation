import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "../components/Header"

export default function Licensing() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Лицензирование оружия</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Получение лицензии</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Для законного владения оружием в штате Сан-Андреас требуется действующая лицензия. Мы предлагаем полный
                спектр услуг по подготовке документов и прохождению необходимых процедур.
              </p>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Требования:</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Возраст 21 год и старше.</li>
                <li>Отсутствие судимостей.</li>
                <li>Пройденный курс по безопасному обращению с оружием.</li>
                <li>Медицинская справка.</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Записаться на консультацию</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Курсы по безопасности</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Наши сертифицированные инструкторы проводят обязательные курсы по безопасному обращению с оружием. Курс
                включает теоретические и практические занятия в тире.
              </p>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Программа курса:</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Основы законодательства об оружии.</li>
                <li>Правила безопасного хранения и транспортировки.</li>
                <li>Практическая стрельба и обращение с различными типами оружия.</li>
                <li>Первая помощь при огнестрельных ранениях.</li>
              </ul>
              <Button className="bg-red-600 hover:bg-red-700">Записаться на курс</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Часто задаваемые вопросы</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Если у вас остались вопросы, посетите наш раздел FAQ или свяжитесь с нами напрямую.
          </p>
          <Button asChild variant="outline" className="mt-6 bg-transparent">
            <Link href="/contacts">Связаться с нами</Link>
          </Button>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
