import Header from "../components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, Briefcase, FileText } from "lucide-react"

const licensingSteps = [
  {
    title: "Этап 1",
    description: "Прохождение психолога в медицинском центре",
    price: "$1400",
    icon: FileCheck,
  },
  {
    title: "Этап 2",
    description: "Прохождение инструктажа у специалистов Ammu-Nation",
    price: "$1 500 - $40 000 (Зависит от категории)",
    icon: Briefcase,
  },
  {
    title: "Этап 3",
    description: "Оформление лицензии в полицейском департаменте",
    price: "$500",
    icon: FileText,
  },
]

const categories = [
  { name: "Категория 9", price: "$ 1 500", description: "(легкие пистолеты)" },
  { name: "Категория A", price: "$ 3 500", description: "(тяжелые пистолеты)" },
  { name: "Категория B", price: "$ 5 000", description: "(гладкоствольное оружие) категория необходимая для охоты" },
  { name: "Категория C", price: "$ 10 000", description: "(пистолеты пулеметы)" },
  { name: "Категория D", price: "$ 40 000", description: "(карабины и винтовки)" },
]

const weaponLimits = [
  { category: "9", limit: 3 },
  { category: "A", limit: 2 },
  { category: "B", limit: 2 },
  { category: "C", limit: 2 },
  { category: "D", limit: 1 },
]

export default function Licensing() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600 text-center">Лицензирование</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {licensingSteps.map((step, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{step.title}</CardTitle>
                <step.icon className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{step.price}</div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Для получения лицензии на огнестрельное оружие необходимо:</h2>
          <ol className="list-decimal list-inside space-y-4">
            <li>
              Направиться в медицинский центр и получить медицинское заключение психолога об отсутствии у гражданина
              противопоказаний для владения огнестрельным оружием.
            </li>
            <li>
              Направиться в центральную "Ammu-Nation" и пройти теоретическое занятие по базовому обращению с оружием,
              после чего сдать теоретический и практический экзамен на основе пройденного курса.
            </li>
            <li>
              Направиться в удобный для Вас участок Полицейского департамента и получить бумажную лицензию
              государственного образца с водными знаками.
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Категории</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{category.price}</p>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Количество оружия разрешенного к покупке по категориям:</h2>
          <ul className="list-disc list-inside space-y-2">
            {weaponLimits.map((limit, index) => (
              <li key={index}>
                Категория {limit.category} - {limit.limit} ед.
              </li>
            ))}
          </ul>
        </div>

        <p className="text-lg">
          Лицензия на оружие действует 2 месяца с момента выдачи, лицензия продлевается в полицейском департаменте.
        </p>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
