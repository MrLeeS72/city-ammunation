import Header from "../components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Clock, Users, Shield, Phone } from "lucide-react"

const vacancies = [
  {
    title: "Продавец-консультант",
    salary: "$7,000 - $13,000",
    schedule: "Гибкий рабочий график",
    experience: "От 1 года",
    icon: Users,
    requirements: [
      "Опыт работы в сфере продаж от 1 года",
      "Знание ассортимента оружия и боеприпасов",
      "Коммуникабельность и клиентоориентированность",
      "Наличие лицензии на работу с оружием (приветствуется)",
      "Чистая репутация и отсутствие судимостей",
    ],
    responsibilities: [
      "Консультирование клиентов по выбору оружия",
      "Оформление документов на продажу",
      "Ведение учета товара",
      "Поддержание порядка в торговом зале",
      "Соблюдение мер безопасности",
    ],
    conditions: [
      "Официальное трудоустройство",
      "Медицинская страховка",
      "Обучение за счет компании",
      "Премии за выполнение плана",
      "Корпоративные скидки на товары",
    ],
  },
  {
    title: "Инструктор по стрельбе",
    salary: "$8,000 - $15,000",
    schedule: "Гибкий рабочий график",
    experience: "От 3 лет",
    icon: Shield,
    requirements: [
      "Опыт инструкторской деятельности от 3 лет",
      "Сертификат инструктора по стрельбе",
      "Отличное знание техники безопасности",
      "Педагогические навыки",
      "Физическая подготовка",
    ],
    responsibilities: [
      "Проведение занятий в тире",
      "Обучение клиентов технике стрельбы",
      "Контроль соблюдения техники безопасности",
      "Подготовка к экзаменам на лицензию",
      "Ведение документации",
    ],
    conditions: [
      "Гибкий график работы",
      "Высокая заработная плата",
      "Профессиональное развитие",
      "Современное оборудование",
      "Дружный коллектив",
    ],
  },
]
export default function Vacancies() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-red-600 text-center">Вакансии</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Присоединяйтесь к команде City Ammu-Nation!</h2>
          <p className="text-gray-600 mb-4">
            Мы ищем профессионалов, которые разделяют наши ценности и готовы развиваться вместе с компанией. City
            Ammu-Nation предлагает стабильную работу, конкурентную заработную плату и возможности для карьерного роста.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <DollarSign className="h-8 w-8 text-red-600 mb-2" />
              <span className="font-semibold">Конкурентная зарплата</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-red-600 mb-2" />
              <span className="font-semibold">Гибкий график</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-red-600 mb-2" />
              <span className="font-semibold">Дружный коллектив</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {vacancies.map((vacancy, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <vacancy.icon className="mr-3 h-6 w-6 text-red-600" />
                  {vacancy.title}
                </CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <DollarSign className="mr-1 h-4 w-4" />
                    {vacancy.salary}
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {vacancy.schedule}
                  </span>
                  <span>Опыт: {vacancy.experience}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Требования:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {vacancy.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Обязанности:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {vacancy.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Условия:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {vacancy.conditions.map((cond, condIndex) => (
                      <li key={condIndex}>{cond}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-red-600" />
              Как подать заявку
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Для подачи заявки на любую из представленных вакансий, пожалуйста, свяжитесь с нами одним из удобных
                способов:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Контактные телефоны:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>Jerry — 735-2879</li>
                    <li>Jared — 262-7153</li>
                    <li>Gracie — 658-0651</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Адрес офиса:</h4>
                  <p className="text-gray-600">
                    Cypress Flats, Popular Street, 9275
                    <br />
                    Прием резюме: Пн-Пт с 9:00 до 18:00
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <a
                  href="https://forms.gle/gWYzHUt8sEqhhkas8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-center inline-block"
                >
                  Подача заявок онлайн
                </a>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Важно:</strong> При подаче заявки обязательно укажите желаемую вакансию и приложите резюме.
                  Все кандидаты проходят проверку службы безопасности в соответствии с требованиями законодательства.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
