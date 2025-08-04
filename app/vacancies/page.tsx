import Header from "../components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, DollarSign } from "lucide-react"

const vacancies = [
  {
    title: "Продавец-консультант",
    department: "Торговый зал",
    salary: "$3,000 - $5,000",
    responsibilities: [
      "Консультирование клиентов по ассортименту оружия и боеприпасов.",
      "Оформление продаж и ведение документации.",
      "Поддержание порядка и чистоты в торговом зале.",
    ],
    requirements: [
      "Знание ассортимента оружия.",
      "Коммуникабельность и вежливость.",
      "Опыт работы в продажах приветствуется.",
    ],
  },
  {
    title: "Инструктор тира",
    department: "Тир",
    salary: "$4,000 - $7,000",
    responsibilities: [
      "Проведение инструктажей по безопасному обращению с оружием.",
      "Обучение клиентов стрельбе в тире.",
      "Контроль за соблюдением правил безопасности.",
    ],
    requirements: [
      "Опыт работы инструктором по стрельбе.",
      "Наличие соответствующих сертификатов.",
      "Ответственность и внимательность.",
    ],
  },
  {
    title: "Специалист по лицензированию",
    department: "Юридический отдел",
    salary: "$3,500 - $6,000",
    responsibilities: [
      "Консультирование клиентов по вопросам получения лицензий на оружие.",
      "Помощь в подготовке и оформлении документов.",
      "Взаимодействие с государственными органами.",
    ],
    requirements: [
      "Юридическое образование или опыт работы в смежной сфере.",
      "Знание законодательства об оружии.",
      "Внимательность к деталям и аккуратность.",
    ],
  },
]

export default function Vacancies() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Вакансии</h1>

        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Присоединяйтесь к команде "Ammu-Nation"! Мы ищем талантливых и ответственных сотрудников, готовых развиваться
          в сфере оборота оружия и безопасности.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vacancies.map((vacancy, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-2xl text-red-600">{vacancy.title}</CardTitle>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Briefcase className="mr-1 h-4 w-4" />
                  {vacancy.department}
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {vacancy.salary}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Обязанности:</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  {vacancy.responsibilities.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Требования:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {vacancy.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Как подать заявку</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Если вас заинтересовала одна из вакансий, отправьте свое резюме и сопроводительное письмо на нашу
            электронную почту: <span className="font-semibold text-red-600">hr@ammunation.com</span>. Мы свяжемся с вами
            в ближайшее время.
          </p>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
