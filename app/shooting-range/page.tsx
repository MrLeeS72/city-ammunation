import Header from '../components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, DollarSign, Clock, Shield } from 'lucide-react'

export default function ShootingRange() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-red-600 text-center">Тир</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-red-600" />
              Адрес
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>К вашим услугам крытый тир в центральном отделение "Ammu-Nation" по адресу: Cypress Flats, Popular Street, 9275</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-red-600" />
                Стоимость
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Стоимость 1 (одного) захода для тренировки в тире: от $ 2000</p>
              <p>В стоимость входит аренда пистолета Beretta M9 и 100 патронов.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-red-600" />
                Ограничения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Гражданским разрешено посещать тренировочные занятия не более 1 раза в 24 часа</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-600" />
              Требования
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Посетить тир может любой гражданин штата.</li>
              <li>Для посещения тира необходима только ваша ID card и оплата услуг тира.</li>
              <li>Для работников структур правопорядка действуют льготные условия тренировок в тире.</li>
              <li>Для тренировки в тире разрешено использование своего оружия, но только при наличии у вас действующей лицензии на ношение и хранение огнестрельного оружия.</li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-600 italic">
          Цены на услуги тира регулирует правительство штата, все претензии и недовольства просьба отправлять в офис губернатора.
        </p>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}
