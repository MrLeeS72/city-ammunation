import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Header from "../components/Header"

export default function Contacts() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600 text-center">Свяжитесь с нами</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Наши контакты</h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                <strong>Адрес:</strong> Бульвар Вайнвуд, Лос-Сантос, Сан-Андреас
              </p>
              <p>
                <strong>Телефон:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Email:</strong> info@ammunation.ls
              </p>
              <p>
                <strong>Часы работы:</strong> Ежедневно с 9:00 до 20:00
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Мы на карте:</h3>
              <div className="relative w-full h-64 rounded-md overflow-hidden">
                <img
                  src="/public/images/los-santos-detailed-map.png"
                  alt="Карта Лос-Сантоса"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-600 text-4xl font-bold">📍</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Отправьте нам сообщение</h2>
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg">
                  Ваше имя
                </Label>
                <Input id="name" type="text" placeholder="Иван Иванов" className="mt-2 p-3" />
              </div>
              <div>
                <Label htmlFor="email" className="text-lg">
                  Ваш Email
                </Label>
                <Input id="email" type="email" placeholder="ivan@example.com" className="mt-2 p-3" />
              </div>
              <div>
                <Label htmlFor="subject" className="text-lg">
                  Тема
                </Label>
                <Input id="subject" type="text" placeholder="Вопрос по лицензированию" className="mt-2 p-3" />
              </div>
              <div>
                <Label htmlFor="message" className="text-lg">
                  Сообщение
                </Label>
                <Textarea id="message" rows={5} placeholder="Ваше сообщение..." className="mt-2 p-3" />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3">
                Отправить сообщение
              </Button>
            </form>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
