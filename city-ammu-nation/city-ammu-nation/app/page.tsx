import Header from './components/Header'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-red-600">Добро пожаловать на сайт магазина City Ammu-Nation</h1>
        <p className="text-xl mb-4">Ваш надежный поставщик оружия и аксессуаров</p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Почему выбирают нас:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Широкий ассортимент оружия и боеприпасов</li>
            <li>Высококачественные аксессуары</li>
            <li>Быстрая доставка по всему Лос-Сантосу</li>
            <li>Профессиональные консультации по выбору оружия</li>
            <li>Гарантия качества на всю продукцию</li>
            <li>Программа лояльности для постоянных клиентов</li>
            <li>Современные средства безопасности для хранения оружия</li>
            <li>Персональный подход к каждому клиенту</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-4 mt-8">
          <Link href="/catalog" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Каталог
          </Link>
          <Link href="/licensing" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Лицензирование
          </Link>
          <Link href="/shooting-range" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Тир
          </Link>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 City Ammu-Nation. Все права защищены.</p>
      </footer>
    </div>
  )
}

